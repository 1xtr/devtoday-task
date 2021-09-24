export interface SinglePost {
  id: number
  title: string
  body: string
  comments?: SingleComment[]
}

export interface SingleComment {
  id: number
  postId: number
  body: string
}
