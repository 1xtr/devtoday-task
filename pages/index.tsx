import type { NextPage, NextPageContext } from 'next'
import MainLayout from '../components/Layouts/mainLayout'
import axios from '../utils/axios-posts'
import { useState } from 'react'
import Link from 'next/link'
import { SinglePost } from '../interfaces/IPosts'
import styled from 'styled-components'

interface OtherProps {
  posts: SinglePost[]
}
const PostCard = styled.div`
  width: 100%;
  padding: 1rem;
  box-shadow: 0 0 1px 1px;
  margin-bottom: 1rem;
  &:hover {
    cursor: pointer;
  }
  border-radius: 5px;
`

const PageTitle = styled.h1`
  text-align: center;
  margin-top: 4rem;
`

const Home: NextPage<OtherProps> = ({ posts: serverPosts }: OtherProps) => {
  const [posts] = useState(serverPosts)
  return (
    <MainLayout>
      <PageTitle>All posts</PageTitle>
      {posts.map((post) => (
        <Link href={'/posts/' + post.id} key={post.id} passHref>
          <PostCard>
            <h3>{post.title}</h3>
            <br />
            Post ID: {post.id}
            <p>{post.body}</p>
          </PostCard>
        </Link>
      ))}
    </MainLayout>
  )
}

export async function getServerSideProps({ req }: NextPageContext) {
  if (!req) {
    return { posts: null }
  }
  const response = await axios.get(`/posts`)
  const posts: SinglePost[] = response.data

  return {
    props: {
      posts,
    },
  }
}

export default Home
