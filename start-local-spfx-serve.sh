if [ -z ${SPFX_dev_cert_trusted} ];
    then 
    export SPFX_dev_cert_trusted="yes"
    echo "!!!! 1st run - generate dev cert"
    gulp trust-dev-cert
fi

NODE_NO_HTTP2=1 gulp serve --nobrowser