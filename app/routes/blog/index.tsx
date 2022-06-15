import { Link, useLoaderData } from "@remix-run/react";

import type { Post } from "~/services/post";
import { getPosts } from "~/services/post";

export const loader = getPosts;

export default function Blog() {
  const posts: Post[] = useLoaderData();

  return (
    <div>
      <h1>Check out our blog posts</h1>

      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={post.slug}>
              {post.title} by {post.author}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
