function(instance, properties, context) {
    
    // Do not recycle
    instance.publishState("downloadtotal", null);
    instance.publishState("downloadsofar", null);
    instance.publishState("downloadurl", null);
    delete instance.data.response;
    delete instance.data.type;
    
    // Bail on missing
    if (properties.remoteurl == null) {
        instance.triggerEvent("actionfailed");
        return;
    }
    
    // Create asynchronous download
    const request = new XMLHttpRequest();
    request.open("GET", properties.remoteurl, true);
    request.responseType = "blob";
            
    // Announce start
    request.addEventListener(
        "loadstart",
        e => {
            if (e.lengthComputable) {
                instance.publishState("downloadtotal", e.total);
                instance.publishState("downloadsofar", e.loaded);
            }
            instance.triggerEvent("downloadstarted");
        }
    );
            
    // Announce increments
    request.addEventListener(
        "progress",
        e => {
            if (e.lengthComputable) {
                instance.publishState("downloadtotal", e.total);
                instance.publishState("downloadsofar", e.loaded);
            }
            instance.triggerEvent("downloadprogressed");
        }
    );
            
    // Announce success
    request.addEventListener(
        "load",
        e => {
            instance.data.response = request.response;
            instance.data.type = request.getResponseHeader('Content-type');
            if (e.lengthComputable) {
                instance.publishState("downloadtotal", e.total);
                instance.publishState("downloadsofar", e.loaded);
            }
            instance.publishState("downloadurl", URL.createObjectURL(instance.data.response));
            instance.triggerEvent("downloadcompleted");
        }
    );
            
    // Announce failure
    request.addEventListener(
        "error",
        e => {
            if (e.lengthComputable) {
                instance.publishState("downloadtotal", e.total);
                instance.publishState("downloadsofar", e.loaded);
            }
            instance.triggerEvent("actionfailed");
        }
    );

    // Announce failure
    request.addEventListener(
        "abort",
        e => {
            if (e.lengthComputable) {
                instance.publishState("downloadtotal", e.total);
                instance.publishState("downloadsofar", e.loaded);
            }
            instance.triggerEvent("actionfailed");
        }
    );

    // Announce failure
    request.addEventListener(
        "timeout",
        e => {
            if (e.lengthComputable) {
                instance.publishState("downloadtotal", e.total);
                instance.publishState("downloadsofar", e.loaded);
            }
            instance.triggerEvent("actionfailed");
        }
    );

    // Dispatch
    request.send();
}