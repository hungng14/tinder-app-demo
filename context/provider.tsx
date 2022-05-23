import { useState, useMemo, useCallback, useEffect } from 'react'
import AppContext from './'
import useHomeData from './Home'


const AppProvider = (props: any) => {
  const data = useHomeData()

  return (
    <AppContext.Provider value={{
        data
    }}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppProvider