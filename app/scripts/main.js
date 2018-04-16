import './sharedModule';
import forEach from './nodeListForEach';
forEach();
import sources from './sources';
import * as _ from 'lodash';
import '../styles/style.css';
import '../styles/appStyles.scss';

function loadRes(){
    var src = new sources();
    src.loadSources().then( () => src.renderSources() );
}


// if (ENVIRONMENT == 'development') {console.log("Development mode")};

document.addEventListener("DOMContentLoaded", loadRes);

// Additional task:
var arr=[ 1, 2, 3];
_.each(arr,function(val) {
 console.log('Output from Lodash _.each for Element ' + val); 
});