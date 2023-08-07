import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks"
import Layout from "../layout/Layout"
import { connect } from "../websocket/websocketSlice"
import AssistancesList from "./partials/AssistancesList"
import { selectActiveCustomer, selectFetchOpenAssistancesState } from "./selectors"
import LoadingBar from "../../components/LoadingBar"


export default function Assistances() {

  const customerKey = useAppSelector(selectActiveCustomer)
  const fetchOpenAssistancesState = useSelector(selectFetchOpenAssistancesState)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(connect("assistances"))
    dispatch(connect("notifications"))
  }, [])

  return (
    <Layout>

      <LoadingBar loading={fetchOpenAssistancesState === 'pending'} />

      {/* assistances list */}
      <div className={`assistances-list ${!customerKey && 'assistances-list--open'}`}>
        <AssistancesList />
      </div>

      {/* assistance customer panel */}
      <div className={`customer-panel ${customerKey && "customer-panel--full"}`}>
        <Outlet />
      </div>

    </Layout>
  )
}