import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import styles from './Home.module.css';
// importing common Card Component
import { Card } from '../../components/shared/Card/Card';
import { Button } from '../../components/shared/Button/Button';

 const Home = () => {

  const signInLinkStyle = {
     color: '#0077ff',
     fontWeight: 'bold',
     textDecoration: 'none',
     marginLeft: '5px'
  };

  // for navigation
const navigate = useNavigate();

function startRegister(){
    navigate('/authenticate');  // redirect kardo authenticate page pe or authenticate component pe
}

  return (
    <div className={styles.cardWrapper}>

      {/* Demonstrating Card Component and sending props */}
      <Card title="Welcome to Conclave!" icon = "Emoji">
      <p className = {styles.text}>Connection is why we’re here; it is what 
        <br></br>
        gives purpose and meaning to our lives   
       </p >
    {/* event listener click hote hi "startRegister" method ko call karenga */}
    <Button onClick = {startRegister} text="Get your Username" icon = "Arrow">

    </Button>
    <div className={styles.signWrapper}>
      <span className={styles.hasInvite}> Have an invite link?</span>
      
      {/* parent component ke andar child component so styling dena hain to inline styling karna padega */}
    <Link style={signInLinkStyle} to="/authenticate"> Sign in</Link>
    </div>
      </Card>
    </div>
  );
};

export default Home;