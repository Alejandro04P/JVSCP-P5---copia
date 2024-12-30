import './JS/iniciarsecion.js';
import './JS/background.js';
import {cambiarPatron} from './JS/background.js';

const link = document.getElementById('change-background');

link.onclick = (e) => {
    cambiarPatron();
}
