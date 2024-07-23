import {useEffect, useState} from 'react'
import Loader from 'react-loader-spinner'

import LeaderboardTable from '../LeaderboardTable'

import {
  LeaderboardContainer,
  LoadingViewContainer,
  ErrorMessage,
} from './styledComponents'

const Leaderboard = () => {
  // Your code goes here...
  const apiStatusConstants = {
    initial: 'INITIAL',
    inProgress: 'IN_PROGRESS',
    success: 'SUCCESS',
    failure: 'FAILURE',
  }
  const [apiResponse, setApiResponse] = useState({
    apiStatus: apiStatusConstants.initial,
    leaderBoardData: null,
    errorMassage: null,
  })

  useEffect(() => {
    const getLeaderBoardData = async () => {
      const url = 'https://apis.ccbp.in/leaderboard'
      const options = {
        method: 'GET',
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwicm9sZSI6IlBSSU1FX1VTRVIiLCJpYXQiOjE2MjMwNjU1MzJ9.D13s5wN3Oh59aa_qtXMo3Ec4wojOx0EZh8Xr5C5sRkU',
        },
      }

      setApiResponse({
        apiStatus: apiStatusConstants.inProgress,
        leaderBoardData: null,
        errorMassage: null,
      })

      const response = await fetch(url, options)
      const responseData = await response.json()
      if (response.ok) {
        setApiResponse(prevState => ({
          ...prevState,
          apiStatus: apiStatusConstants.success,
          leaderBoardData: responseData,
        }))
      } else {
        setApiResponse(prevState => ({
          ...prevState,
          apiStatus: apiStatusConstants.failure,
          errorMassage: responseData.error_msg,
        }))
      }
    }
    getLeaderBoardData()
  }, [])

  const renderLoadingView = () => (
    <LoadingViewContainer>
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </LoadingViewContainer>
  )

  const renderSuccessView = () => {
    const {leaderBoardData} = apiResponse
    console.log(leaderBoardData)
    const formatedLeaderboardData = leaderBoardData.leaderboard_data.map(
      eachUser => ({
        id: eachUser.id,
        rank: eachUser.rank,
        name: eachUser.name,
        profileImgUrl: eachUser.profile_image_url,
        score: eachUser.score,
        language: eachUser.language,
        timeSpent: eachUser.time_spent,
      }),
    )
    console.log(formatedLeaderboardData)
    return <LeaderboardTable leaderboardData={formatedLeaderboardData} />
  }
  const renderFailureView = () => {
    const {errorMassage} = apiResponse
    return <ErrorMessage>{errorMassage}</ErrorMessage>
  }

  const renderLeaderboard = () => {
    const {apiStatus} = apiResponse
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      case apiStatusConstants.success:
        return renderSuccessView()
      case apiStatusConstants.failure:
        return renderFailureView()
      default:
        return null
    }
  }

  return <LeaderboardContainer>{renderLeaderboard()}</LeaderboardContainer>
}

export default Leaderboard
