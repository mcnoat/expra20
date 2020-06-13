function getURLParameter(sParam) {

    let sPageURL = window.location.search.substring(1);
    let sURLVariables = sPageURL.split('&');
    for (let i = 0; i < sURLVariables.length; i++) 
    {
        let sParameterName = sURLVariables[i].split('=');
        //if the attribute is equal to the requested one...
        if (sParameterName[0] == sParam) 
        {
            //...return its value
            return sParameterName[1];
        }
    }
}