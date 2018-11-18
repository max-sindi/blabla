import * as React from 'react'
import * as g from '../../../../index.css';
import { iconWrap } from '../style.css';

const DateIcon = () => {
  return (
    <div className={`${g.flex} ${g.aic} ${iconWrap}`}>
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path id="a" d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zM7 12h5v5H7v-5z"/>
      </svg>
    </div>
  )
}

export default DateIcon
