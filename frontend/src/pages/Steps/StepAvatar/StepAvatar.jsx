import React, { useState } from 'react';
import {Card} from '../../../components/shared/Card/Card';
import {Button} from '../../../components/shared/Button/Button';

import styles from './StepAvatar.module.css';

import { useSelector, useDispatch } from 'react-redux';
import { setAvatar } from '../../../store/activateSlice';
import { activate } from '../../../http';
import { setAuth } from '../../../store/authSlice';

import Loader from '../../../components/shared/Loader/Loader';

const StepAvatar = ({ onNext }) => {
    const dispatch = useDispatch();
    const { name, avatar } = useSelector((state) => state.activate);
    
    const [image, setImage] = useState('/images/avatar.png');

    const [loading, setLoading] = useState(false);

    function captureImage(e) {
        const file = e.target.files[0];  // capture that photo in "file"

        // Now using Browser in-built APIs
        /*
        Basically jo bhi image hain wo file format mein hain, we will convert this file in base64 string
        */

        const reader = new FileReader(); // first make FileReader APIs ka instacne
        reader.readAsDataURL(file);   // reader file ko read karo
        
        // reader takes some time to load file, after file get loaded callback funtion is called
        reader.onloadend = function () {
            setImage(reader.result);
            dispatch(setAvatar(reader.result));
        };
    }

    async function submit() {

        if(!name || !avatar){
            window.alert("Please choose a Different Photo");
            return;
        }

        setLoading(true);

        try {
            const { data } = await activate({ name, avatar });
            
            if (data.auth) {
                dispatch(setAuth(data));   // jo hamara update user hain(with name and avatar) usko store mein update karo
            }
            console.log(data);
        } catch (err) {
            console.log(err);
        }  finally {
            setLoading(false);
        }
    }

    if (loading) return <Loader message="Activation in progress..." />;

    return (
        <>
            <Card title={`Okay, ${name}`} icon="monkey">
                <p className={styles.subHeading}>How’s this photo?</p>
                <div className={styles.avatarWrapper}>
                    <img
                        className={styles.avatarImage}
                        src={image}
                        alt="avatar"
                    />
                </div>
                <div>
                    <input
                        onChange={captureImage}
                        id="avatarInput"   // input or label ko connect rakhte hain id se
                        type="file"
                        className={styles.avatarInput}
                    />
                    <label className={styles.avatarLabel} htmlFor="avatarInput">
                        Choose a different photo
                    </label>
                </div>
                <div>
                    <Button onClick={submit} text="Next" icon = "Arrow"/>
                </div>
            </Card>
        </>
    );
};

export default StepAvatar;