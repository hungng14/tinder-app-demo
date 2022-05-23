import { createContext, useContext } from 'react'

type ValueOfContext = {
    [k: string]: any;
}

const AppContext = createContext<ValueOfContext>({})

export default AppContext

export const useAppContext = () => {
  const context = useContext(AppContext)
  return context
}
