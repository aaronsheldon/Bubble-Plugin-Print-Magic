function(instance, properties, context) {

    // Bail on missing
    if (properties.localurl == null) {
        instance.triggerEvent("actionfailed");
        return;
    }
    if (properties.localfilename == null) {
        instance.triggerEvent("actionfailed");
        return;
    }
    if (instance.data.response == null) {
        instance.triggerEvent("actionfailed");
        return;
    }

    // Retreat to URL for unspecified content
    const options = {};
    if (instance.data.type == null) {
        options.url = properties.localurl;
    }

	// Otherwise share binary
	else {
        options.files = [
            new File(
                [instance.data.response],
                properties.localfilename,
                { type: instance.data.type }
            )
        ];
    }
    
    // Prompt to save the file
    if (!navigator.canShare) {
        const alink = document.createElement("a");
        alink.download = properties.localfilename;
        alink.href = properties.localurl;
        instance.canvas.appendChild(alink);
        alink.click();
        alink.remove();
        return;
    }
    
    // Prompt to share the file
    if (navigator.canShare(options)) {
        navigator.share(options);
    }
    
    // Prompt to save the file
    else {
        const alink = document.createElement("a");
        alink.download = properties.localfilename;
        alink.href = properties.localurl;
        instance.canvas.appendChild(alink);
        alink.click();
        alink.remove();
    }
}