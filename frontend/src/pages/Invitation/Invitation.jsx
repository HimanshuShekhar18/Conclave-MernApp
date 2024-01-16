import {useState, React,  } from 'react'
import {useNavigate} from 'react-router-dom'
import { Card } from '../../components/shared/Card/Card';
import { Button } from '../../components/shared/Button/Button';
import { Textinput } from "../../components/shared/Textinput/Textinput";
import styles from "./Invitation.module.css";


export const Invitation = () => {

      const [linkname, setLinkname] = useState('');

      const navigate = useNavigate();

      function next (){        
        navigate(`/${linkname}`);
      }
 
      return (
            <div className={styles.cardWrapper}>
              <Card title="Wanna Join Privately?" icon="chasmaemoji">
                <Textinput
                  placeholder="Paste your secret link here"
                  value={linkname}
                  onChange={(e) => setLinkname(e.target.value)}
                  onClear={() => setLinkname("")}
                />
                <p >
            Some Meetings and Talks happens Secretely :) !
                </p>
                <div>
                  <Button onClick={next} text="Join Privately" icon="Arrow" />
                </div>
              </Card>
            </div>
          );
}