import React from 'react'
import "../style/Footer.css"
import Logo from "../assets/cafeMenuLogo.webp";

function Footer() {
  return (
    <div className='Footer'>
        <div className="footerLogo">
            <img className="footerLogo" src={Logo} alt="Logo" />
        </div>
        <div className="workHour">
            <h3>Çalışma Saatleri</h3>
            <h4>Tüm Günler:</h4>
            <p>08:00 - 00:00</p>
        </div>
        <div className="contactUs">
            <h3>Bize Ulaşın</h3>
            <h4 className='contactUsTitle'>Adres: </h4>
            <span>Özlüce Mah. Çakır Caddesi 18/C Nilüfer/Bursa</span>
            <h4 className='contactUsTitle'>E-Mail: </h4>
            <span>cartcurtcafe@gmail.com</span>
            <h4 className='contactUsTitle'>Telefon: </h4>
            <span>+90 530 530 30 30</span>
        </div>
        <div className="googleMaps">
        <iframe  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d16678.82085217123!2d28.921479459647312!3d40.219149190703426!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1str!2str!4v1725972517711!5m2!1str!2str" width="300" height="300" style={{border:"0"}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
    </div>
  )
}

export default Footer