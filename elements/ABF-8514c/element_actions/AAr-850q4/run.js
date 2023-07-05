function(instance, properties, context) {

    // Bail on missing
    if (properties.localurl == null) {
        instance.triggerEvent("actionfailed");
        return;
    }
    
    // Revoke
    URL.revokeObjectURL(properties.localurl);
}