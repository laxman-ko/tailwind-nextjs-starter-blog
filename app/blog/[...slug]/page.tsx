// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const posts = [{ slug: 'test' }, { slug: 'test2' }]

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Multiple versions of this page will be statically generated
// using the `params` returned by `generateStaticParams`
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  console.log(slug)
  return <h1>{slug}</h1>
}
