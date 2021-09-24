import React, { useState } from 'react'
import axios from '../utils/axios-posts'
import MainLayout from '../components/Layouts/mainLayout'
import styled from 'styled-components'
import { useRouter } from 'next/router'

const PageTitle = styled.h1`
  text-align: center;
  margin-top: 4rem;
`

export const StyledInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  font-family: inherit;
  outline: #157575;
  margin-bottom: 1rem;
`

const StyledTextArea = styled.textarea`
  resize: none;
  width: 100%;
  height: 50px;
  padding: 0.5rem;
  font-size: 1rem;
  outline: #157575;
  margin-bottom: 1rem;
`

export const StyledLabel = styled.label`
  display: block;
  padding: 0.5rem;
`

const StyledButton = styled.button`
  border: 1px solid #157575;
  padding: 0.5rem 2rem;
  border-radius: 5px;
  font-size: 1.25rem;
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

const Create = () => {
  const router = useRouter()
  const [form, setForm] = useState({})

  const createButtonHandler = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    try {
      const response = await axios.post('/posts', form)
      await router.push(`/posts/${response.data.id}`)
    } catch (e: any) {
      console.log('Send post error: ', e.message)
    }
  }

  const inputChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  return (
    <MainLayout>
      <PageTitle>Create post</PageTitle>
      <StyledLabel htmlFor="title">Title</StyledLabel>
      <StyledInput
        type="text"
        id="title"
        name="title"
        minLength={3}
        maxLength={50}
        placeholder={'Post title'}
        onChange={inputChangeHandler}
      />
      <StyledLabel htmlFor="content">Post text</StyledLabel>
      <StyledTextArea
        id="body"
        name="body"
        placeholder="Put some text here..."
        minLength={3}
        maxLength={500}
        onChange={inputChangeHandler}
      />
      <StyledButton onClick={createButtonHandler}>Create!</StyledButton>
    </MainLayout>
  )
}

export default Create
