const handleFailError = () => {
  const error = new Error('Resource not found')
  error.statusCode = 404
  throw error
}

export default handleFailError
