global.$ = require('jquery');
global.jQuery = $;

require('bootstrap');

var dt_extras = [
    require("datatables.net"),
    require("datatables.net-bs"),
    require("datatables.net-buttons"),
    require("datatables.net-responsive"),
    require("datatables.net-buttons-bs"),
    require("datatables.net-responsive-bs")
];

dt_extras.forEach(function(e) {e(window, $);});