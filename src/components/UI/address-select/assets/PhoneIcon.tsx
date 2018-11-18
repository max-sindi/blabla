import * as React from 'react'
import * as g from '../../../../index.css';
import { iconWrap } from '../style.css';

const PhoneIcon = () => {
  return (
    <div className={`${g.flex} ${g.aic} ${iconWrap}`}>
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path id="b" d="M16.995 1.01l-10-.01c-1.1 0-1.99.9-1.99 2v18c0 1.1.89 2 1.99 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zm0 17.99h-10V5h10v14z"/>
      </svg>
    </div>

  )
}

export default PhoneIcon;
