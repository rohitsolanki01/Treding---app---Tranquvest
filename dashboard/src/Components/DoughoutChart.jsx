import React from 'react'
import {Chart as ChartJs , ArcElement , Tooltip , Legend} from "chart.js"
import {Chart, Doughnut} from "react-chartjs-2";
   

ChartJs.register(ArcElement,Tooltip,Legend);

const DoughoutChart = ({data }) => {
  return (
    <Doughnut data={data} />
  )
}

export default DoughoutChart