import fs from "fs";
import matter from "gray-matter";
import Layout from "../component/layout";
import Link from "next/link";

export default function Home({ posts }) {
  return (
    <Layout>
    <div>
       {posts.map(({ frontmatter: { title, description, date },slug }) => (
        <article key={slug}>
          <header>
          <h3 className="mb-2">
          <Link href={"/post/[slug]"} as={`/post/${slug}`}>
                <a className="text-3xl font-semibold text-orange-600 no-underline">
                  {title}
                </a>
            </Link>
            </h3>
            <span>{date}</span>
          </header>
          <section>
            <p>{description}</p>
          </section>
        </article>
      ))}
    </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const files = fs.readdirSync(`${process.cwd()}/content/posts`);

  const posts = files.map((filename) => {
    const markdownWithMetadata = fs
      .readFileSync(`content/posts/${filename}`)
      .toString();

    const { data } = matter(markdownWithMetadata);

    // Convert post date to format: Month day, Year
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = data.date.toLocaleDateString("en-US", options);

    const frontmatter = {
      ...data,
      date: formattedDate,
    };

    return {
      slug: filename.replace(".md", ""),
      frontmatter,
    };
  });

  return {
    props: {
      posts,
    },
  };
}