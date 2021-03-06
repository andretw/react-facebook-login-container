import React, { PropTypes } from 'react';

class FacebookLoginLight extends React.Component {

  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    callback: PropTypes.func.isRequired,
    appId: PropTypes.string.isRequired,
    xfbml: PropTypes.bool,
    cookie: PropTypes.bool,
    scope: PropTypes.string,
    typeButton: PropTypes.string,
    autoLoad: PropTypes.bool,
    fields: PropTypes.string,
    version: PropTypes.string,
    language: PropTypes.string,
  };

  static defaultProps = {
    children: null,
    typeButton: 'button',
    scope: 'public_profile,email',
    xfbml: false,
    cookie: false,
    fields: 'name',
    version: '2.3',
    language: 'en_US',
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { appId, xfbml, cookie, version, autoLoad, language } = this.props;
    const fbRoot = document.createElement('div');
    fbRoot.id = 'fb-root';

    document.body.appendChild(fbRoot);

    window.fbAsyncInit = () => {
      window.FB.init({
        version: `v${version}`,
        appId,
        xfbml,
        cookie,
      });

      if (autoLoad || window.location.search.includes('facebookdirect')) {
        window.FB.getLoginStatus(this.checkLoginState);
      }
    };
    // Load the SDK asynchronously
    ((d, s, id) => {
      const element = d.getElementsByTagName(s)[0];
      const fjs = element;
      let js = element;
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = `//connect.facebook.net/${language}/all.js`;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }

  responseApi = (authResponse) => {
    window.FB.api('/me', { fields: this.props.fields }, (me) => {
      Object.assign(me, authResponse);
      this.props.callback(me);
    });
  };

  checkLoginState = (response) => {
    if (response.authResponse) {
      this.responseApi(response.authResponse);
    } else {
      if (this.props.callback) {
        this.props.callback({ status: response.status });
      }
    }
  };

  click = () => {
    const { scope, appId } = this.props;
    if (navigator.userAgent.match('CriOS')) {
      window.location.href = `https://www.facebook.com/dialog/oauth?client_id=${appId}&redirect_uri=${window.location.href}&state=facebookdirect&${scope}`;
    } else {
      window.FB.login(this.checkLoginState, { scope });
    }
  };

  render() {
    const { className, children } = this.props;

    return (
      <button
        className={className}
        onClick={this.click}
      >
      {children}
      </button>
    );
  }
}

export default FacebookLoginLight;
