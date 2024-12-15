import { hostName } from '../../global';
import {
    USER_INFO_REQUERST,
    USER_INFO_SUCCESS,
    USER_INFO_ERROR
} from './ActionType';
import axios from "axios";


export const loadUserInfo=(id)=>async (dispatch)=>{

    const accessToken= JSON.parse(localStorage.getItem("data")).access_token;
    dispatch({type:USER_INFO_REQUERST});
       
        try {
            let data = '';

            let config = {
              method: 'get',
              maxBodyLength: Infinity,
              url: `${hostName}/profile`,
              headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${accessToken}`
              },
              data : data
            };
            axios.request(config)
            .then((response) => {
                console.log("haha");
                dispatch({type: USER_INFO_SUCCESS,payload : response.data.data});
                console.log("in the logi func try",response.data.data);
              })
              .catch((error) => {
                console.log(error);
              });
          
      
        } catch (error) {
            // console.log("in the logi func catch");
            dispatch({type:USER_INFO_ERROR,payload : error.message});
        }
}