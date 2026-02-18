import React from 'react'
import logoSrc from '../../assets/image/vernikaLogo.jpeg';

const Logo = () => {
  return (
    <div>
      <img className='w-29 h-28 object-contain bg-transparent' src={logoSrc} alt="Varnika Organic Logo" />
    </div>
  )
}

export default Logo