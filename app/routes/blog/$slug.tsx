import type { LoaderFunction } from "@remix-run/node";

import { useLoaderData } from "@remix-run/react";

import invariant from "tiny-invariant";

import { getPost } from "~/services/post";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "Expected `params.slug`.");

  return getPost(params.slug);
};

export default function BlogPostSlug() {
  const post = useLoaderData();

  return (
    <div>
      <h1>{post.title}</h1>
      <i>by {post.author}</i>

      <hr />

      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </div>
  );
}
