import path from "path";
import fs from "fs/promises";
import parseFrontMatter from "front-matter";
import invariant from "tiny-invariant";
import { marked } from "marked";
import slugify from "slugify";

export type Post = {
  slug: string;
  title: string;
  author: string;
  markdown: string;
};

export type PostMarkdownAttributes = {
  title: string;
  author: string;
};

export const postsPath = path.join(__dirname, "..", "posts");

export function isValidPostAttributes(
  attributes: any
): attributes is PostMarkdownAttributes {
  return attributes?.title && attributes?.author;
}

export function slugifyFilename(filename: string) {
  return slugify(filename.replace(/\.md$/, ""), {
    lower: true,
    strict: true,
  });
}

export async function matchFilenameWithSlug(slug: string) {
  const files = await fs.readdir(postsPath);

  let matchedFilename;

  for (const file of files) {
    const slugifiedFilename = slugifyFilename(path.parse(file).name);

    if (slugifiedFilename === slug) {
      matchedFilename = file;

      break;
    }
  }

  invariant(matchedFilename, `File ${matchedFilename} could not be found.`);

  return matchedFilename;
}

export async function getPosts() {
  const dir = await fs.readdir(postsPath);

  return Promise.all(
    dir.map(async (filename) => {
      const file = await fs.readFile(path.join(postsPath, filename));

      const { attributes } = parseFrontMatter(file.toString());

      invariant(
        isValidPostAttributes(attributes),
        `File ${filename} has bad meta data!`
      );

      return {
        slug: slugifyFilename(filename),

        title: attributes.title,
        author: attributes.author,
      };
    })
  );
}

export async function getPost(slug: string) {
  const matchedFilename = await matchFilenameWithSlug(slug);

  const filepath = path.join(postsPath, matchedFilename);

  const file = await fs.readFile(filepath);

  const { attributes, body } = parseFrontMatter(file.toString());

  invariant(
    isValidPostAttributes(attributes),
    `Post ${filepath} is missing attributes.`
  );

  return {
    slug,

    title: attributes.title,
    author: attributes.author,

    html: marked(body),
  };
}
