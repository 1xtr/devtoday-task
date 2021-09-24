import React, { useEffect, useState } from 'react'
import { NextPageContext } from 'next'
import Link from 'next/link'
import { SinglePost, SingleComment } from '../../interfaces/IPosts'
import axios from '../../utils/axios-posts'
import MainLayout from '../../components/Layouts/mainLayout'
import styled from 'styled-components'
import { StyledInput } from '../new'

interface PostPageProps {
  post: SinglePost
}

const Button = styled.button``

const CommentsBox = styled.div`
  padding: 1rem;
`

const CommentCard = styled.p`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  border: 1px solid #157575;
  border-radius: 5px;
`

const StyledButton = styled.button`
  border: 1px solid #157575;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-size: 1rem;
  color: #157575;
  font-weight: bold;
  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }
  &:focus {
    box-shadow: inset 0 0 3px 1px #157575;
  }
`

const Post = ({ post: serverPost }: PostPageProps) => {
  const [post] = useState(serverPost)
  const defaultCommentForm = {
    postId: post.id,
    body: ''
  }
  const [form, setForm] = useState(defaultCommentForm)
  const [haveNewComments, setHaveNewComments] = useState(false)

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const createCommentHandler = () => {
    axios.post(`/comments`, form).then((response) => {
      if (response.status === 201) {
        setHaveNewComments(true)
        setForm(defaultCommentForm)
      }
    })
  }

  const deletePostHandler = () => {
    axios.delete(`/posts/${post.id}`).then((response) => response)
  }
  useEffect(() => {
    async function reloadComments() {
      const response = await axios.get(`/posts/${post.id}?_embed=comments`)
      post.comments = response.data.comments
      setHaveNewComments(false)
    }
    reloadComments()
  }, [haveNewComments, post])

  return (
    <MainLayout>
      <h1>Post ID: {post.id}</h1>
      Message:
      <p>{post.body}</p>
      <button onClick={deletePostHandler} disabled>
        Delete post
      </button>
      <hr />
      Comments:
      <CommentsBox>
        <StyledInput
          type="text"
          id="body"
          name="body"
          minLength={3}
          maxLength={50}
          placeholder={'Post comment'}
          value={form.body}
          onChange={inputChangeHandler}
        />
        <StyledButton onClick={createCommentHandler}>
          Write comment
        </StyledButton>
        {post.comments?.map((c: SingleComment) => (
          <CommentCard key={c.id}>
            {c.body}
            <button disabled>delete</button>
          </CommentCard>
        ))}
      </CommentsBox>
      <Link href={'/'} passHref>
        <Button>back to all posts</Button>
      </Link>
    </MainLayout>
  )
}

interface PostNextPageContext extends NextPageContext {
  query: {
    postId: string
  }
}

export async function getServerSideProps({ query }: PostNextPageContext) {
  const postId = +query.postId
  const response = await axios.get(`/posts/${postId}?_embed=comments`)
  const post: SinglePost = response.data
  return {
    props: {
      post,
    },
  }
}

export default Post
