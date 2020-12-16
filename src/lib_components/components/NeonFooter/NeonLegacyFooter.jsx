import React from 'react';
import './NeonFooter.css';

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Theme from '../Theme/Theme';

import LogoFooter from './images/logo--footer.png';
import NewsletterIcon from './images/social--newsletter.png';

require('font-awesome/css/font-awesome.min.css');

const useStyles = makeStyles((theme) => ({
  box: {
    padding: theme.spacing(0),
    margin: theme.spacing(0),
  },
  container: {
    padding: theme.spacing(1, 4),
    backgroundColor: '#fff',
    boxShadow: '0 50vh 0 50vh #fff',
  },
  smContainer: {
    padding: theme.spacing(2, 0),
    display: 'flex',
    justifyContent: 'space-around',
  },
  smCaption: {
    padding: theme.spacing(0),
    marginBottom: theme.spacing(2),
    color: theme.palette.grey[300],
    textAlign: 'justify',
  },
  smCopyright: {
    padding: theme.spacing(0),
    color: theme.palette.grey[300],
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  linkIcon: {
    color: theme.palette.grey[200],
    '&:hover, &:focus': {
      color: theme.palette.grey[500],
    },
  },
  newsletterIcon: {
    verticalAlign: 'middle',
    marginRight: theme.spacing(1),
    opacity: 0.6,
    '&:hover, &:focus': {
      opacity: 1,
    },
  },
  footerTextLink: {
    color: '#00a1b1',
  },
}));

export default function NeonFooter() {
  const classes = useStyles(Theme);
  const year = new Date().getFullYear();
  const copyrightDisplay = `© ${year.toString()} Battelle`;
  const bottomCaption = `
The National Ecological Observatory Network is a major facility fully funded by
the National Science Foundation. Any opinions, findings and conclusions or
recommendations expressed in this material do not necessarily reflect the views
of the National Science Foundation.
`;
  return (
    <div className={classes.box} data-selenium="neon-footer">
      <Divider />
      <Container className={classes.container}>
        <Hidden mdUp>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Container style={{ padding: Theme.spacing(2, 0) }}>
                <Link
                  className={classes.footerTextLink}
                  title="Sign up for the NEON Newsletter"
                  href="http://visitor.r20.constantcontact.com/manage/optin?v=001VGGvr8xQIKjYc_kFiPLlwv2eCR5mvCy-l84uOGp_mC-N67a0MgiOjSJIWa1ZibyTJYm9YZbvasF-RX5OWfNMI7gIq2IjIF6fDARps7B---g%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    title="Sign up for the NEON Newsletter"
                    alt="Sign up for the NEON Newsletter"
                    src={NewsletterIcon}
                    className={classes.newsletterIcon}
                  />
                  Newsletter
                </Link>
              </Container>
            </Grid>
            <Grid item xs={6}>
              <Container className={classes.smContainer}>
                <Link
                  className={classes.linkIcon}
                  title="Facebook"
                  href="https://www.facebook.com/NEONScienceData"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa fa-facebook-square fa-2x fa-fw" />
                </Link>
                <Link
                  className={classes.linkIcon}
                  title="Twitter"
                  href="https://twitter.com/NEON_Sci"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa fa-twitter-square fa-2x fa-fw" />
                </Link>
                <Link
                  className={classes.linkIcon}
                  title="LinkedIn"
                  href="https://www.linkedin.com/company/neon-science/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa fa-linkedin-square fa-2x fa-fw" />
                </Link>
                <Link
                  className={classes.linkIcon}
                  title="YouTube"
                  href="https://www.youtube.com/neonscience"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa fa-youtube-square fa-2x fa-fw" />
                </Link>
              </Container>
            </Grid>
          </Grid>
          <Divider />
          <Container className={classes.smContainer}>
            <Link className={classes.footerTextLink} href="http://www.neonscience.org/about/contact">Contact</Link>
            <Link className={classes.footerTextLink} href="http://www.neonscience.org/opportunities/careers">Careers</Link>
            <Link className={classes.footerTextLink} href="http://www.neonscience.org/about/faq">FAQ</Link>
            <Link className={classes.footerTextLink} href="http://www.neonscience.org/about/contact/media">Media</Link>
            <Link className={classes.footerTextLink} href="http://www.neonscience.org/about/terms-use">Terms of Use</Link>
          </Container>
          <Container className={classes.smCaption}>
            <Typography variant="caption">
              {bottomCaption}
            </Typography>
          </Container>
          <Container className={classes.smCopyright}>
            <Typography variant="caption">
              {copyrightDisplay}
            </Typography>
            <img
              src={LogoFooter}
              style={{ maxHeight: Theme.spacing(2) }}
              title="Proudly operated by Battelle"
              alt="Proudly operated by Battelle"
            />
          </Container>
        </Hidden>
        <Hidden smDown>
          <div className="neon-footer">
            <img
              src={LogoFooter}
              className="neon-footer__logo--footer"
              title="Proudly operated by Battelle"
              alt="Proudly operated by Battelle"
            />
            <div className="neon-footer__box neon-footer__div--social">
              <a
                title="Sign up for our Newsletter"
                className="neon-footer__social--logo neon-footer__neon-logo"
                href="http://visitor.r20.constantcontact.com/manage/optin?v=001VGGvr8xQIKjYc_kFiPLlwv2eCR5mvCy-l84uOGp_mC-N67a0MgiOjSJIWa1ZibyTJYm9YZbvasF-RX5OWfNMI7gIq2IjIF6fDARps7B---g%3D"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sign Up for Our Newsletter
              </a>

              <a
                title="Facebook"
                className="neon-footer__social--logo neon-footer__facebook"
                href="https://www.facebook.com/NEONScienceData"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>

              <a
                title="Twitter"
                className="neon-footer__social--logo neon-footer__twitter"
                href="https://twitter.com/NEON_Sci"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>

              <a
                title="LinkedIn"
                className="neon-footer__social--logo neon-footer__linkedin"
                href="https://www.linkedin.com/company/neon-science/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>

              <a
                title="YouTube"
                className="neon-footer__logo--social neon-footer__youtube"
                href="https://www.youtube.com/neonscience"
                target="_blank"
                rel="noopener noreferrer"
              >
                YouTube
              </a>
            </div>

            <div className="neon-footer__box neon-footer__div--contact">
              <a
                className="neon-footer__link--contact"
                href="http://www.neonscience.org/about/contact"
              >
                Contact
              </a>
              <a
                className="neon-footer__link--contact"
                href="http://www.neonscience.org/opportunities/careers"
              >
                Careers
              </a>
              <a
                className="neon-footer__link--contact"
                href="http://www.neonscience.org/about/faq"
              >
                FAQ
              </a>
              <a
                className="neon-footer__link--contact"
                href="http://www.neonscience.org/about/contact/media"
              >
                Media
              </a>
              <a
                className="neon-footer__link--contact"
                href="http://www.neonscience.org/about/terms-use"
              >
                Terms of Use
              </a>
              <div className="neon-footer__icon--tower" />
            </div>

            <div className="neon-footer__box neon-footer__text--nsf">
              <div className="neon-footer__span--nsf-text">
                {bottomCaption}
              </div>
            </div>

            <div className="neon-footer__box neon-footer__text--battelle">{copyrightDisplay}</div>

          </div>
        </Hidden>
      </Container>
    </div>
  );
}
