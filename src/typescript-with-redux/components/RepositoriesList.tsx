import { useState } from 'react'
import { useActions } from '../hooks/useActions'
import { useTypedSelector } from '../hooks/useTypedSelector'

const RepositoriesList: React.FC = () => {
  const [term, setTerm] = useState('')
  const { searchRepositories } = useActions()
  const { data, error, loading } = useTypedSelector(
    (s) => s.repositories
  )

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    searchRepositories(term)
  }

  if (loading) {
    return (
      <>
        <h2>Loadinг...</h2>
      </>
    )
  }

  if (error) {
    return (
      <>
        <h2>Error occured (((</h2>
      </>
    )
  }

  return (
    <>
      <form onSubmit={submitHandler}>
        <input
          type='text'
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <button>Search</button>
        <pre>{JSON.stringify(data, null, 4)}</pre>
      </form>
    </>
  )
}

export default RepositoriesList
