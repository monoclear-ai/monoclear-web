import Router from 'next/router'
import React, { useEffect } from 'react'

/*
  Default page configuration.
*/
export default function Admin () {
  useEffect(() => {
    Router.push('/admin/leaderboard_all')
  })

  return <></>
}
