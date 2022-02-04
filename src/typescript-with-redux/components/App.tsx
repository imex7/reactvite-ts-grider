import { Provider } from 'react-redux'
import { store } from '../state'
import RepositoriesList from './RepositoriesList'

const App = () => {
  return (
    <Provider store={store}>
      <h2>Search for Package</h2>
      <RepositoriesList />
    </Provider>
  )
}

export default App
