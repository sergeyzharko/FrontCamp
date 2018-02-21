import './sharedModule';
import forEach from './nodeListForEach';
forEach();
import loadSources from './sources';
import * as _ from 'lodash';
import '../styles/style.css';
import '../styles/appStyles.scss';
// import homeIcon from '../images/home.png';
// import natureImg from '../images/nature.jpg';

function loadRes(){
    // var homeImg = document.getElementById('home');
    // homeImg.src = homeIcon;
    
    // var frontImg = document.getElementById('frontImg');
    // frontImg.src = natureImg;

    loadSources();
}


// if (ENVIRONMENT == 'development') {console.log("Development mode")};

document.addEventListener("DOMContentLoaded", loadRes);

var arr=[ 1, 2, 3];
_.each(arr,function(val) {
 console.log('Output from Lodash _.each for Element ' + val); 
});