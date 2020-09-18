import React from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';

import { User } from '@caravanapp/types';
import {
  Container,
  createStyles,
  IconButton,
  makeStyles,
  Theme,
  Typography,
  Link,
} from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';

import Header from '../../components/Header';
import ProfileHeaderIcon from '../../components/ProfileHeaderIcon';
import textLogo from '../../resources/text-logo.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textContainer: {
      padding: `${theme.spacing(6)}px 16px`,
    },
    title: {},
    subtitle: {},
  })
);

interface PrivacyProps extends RouteComponentProps<{}> {
  user: User | null;
}

const title = 'Privacy Policy';

const subtitle = 'Effective date: June 21, 2019';

export default function Privacy(props: PrivacyProps) {
  const { user } = props;
  const classes = useStyles();
  const history = useHistory();

  const handleBack = () => {
    if (history.length > 2) {
      history.goBack();
    } else {
      history.replace('/');
    }
  };

  const leftComponent = (
    <IconButton edge="start" aria-label="Back" onClick={handleBack}>
      <ArrowBackIos />
    </IconButton>
  );

  const centerComponent = (
    <img
      src={textLogo}
      alt="Caravan logo"
      style={{ height: 20, objectFit: 'contain' }}
    />
  );

  const rightComponent = <ProfileHeaderIcon user={user} />;

  return (
    <>
      <Header
        leftComponent={leftComponent}
        centerComponent={centerComponent}
        rightComponent={rightComponent}
      />
      <Container maxWidth="md" className={classes.textContainer}>
        <Typography variant="h3" className={classes.title} gutterBottom>
          {title}
        </Typography>
        <Typography
          variant="h5"
          color="textSecondary"
          className={classes.subtitle}
        >
          {subtitle}
        </Typography>
<Typography variant="body1">
          <p>
            Caravan ("us", "we", or "our") operates the https://caravanapp.ca/ website (hereinafter referred to as the "Service").
          </p>
          <p>
            This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data. Our Privacy Policy for Caravan is created with the help of the{' '}<Link target="_blank" rel="noopener" underline="always" href="https://www.privacypolicies.com/free-privacy-policy-generator/">Privacy Policy Generator</Link>.
          </p>
          <p>
            We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, the terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, accessible from https://caravanapp.ca.
          </p>

        <h3>
          Information Collection And Use
        </h3>

          <p>            
          We collect several different types of information for various purposes to provide and improve our Service to you.
          </p>

        <h3>
          Types of Data Collected
        </h3>
        <h4>
          Personal Data
        </h4>

          <p>
            While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:
          </p>
          <ul>
            <li>Cookies and Usage Data</li>
          </ul>

        <h4>
          Usage Data
        </h4>

          <p>
            We may also collect information on how the Service is accessed and used
            ("Usage Data"). This Usage Data may include information such as your
            computer's Internet Protocol address (e.g. IP address), browser type,
            browser version, the pages of our Service that you visit, the time and
            date of your visit, the time spent on those pages, unique device
            identifiers and other diagnostic data.
          </p>

        <h4>
          Tracking &amp; Cookies Data
        </h4>

          <p>
            We use cookies and similar tracking technologies to track the activity
            on our Service and hold certain information.
          </p>
          <p>
            Cookies are files with small amount of data which may include an
            anonymous unique identifier. Cookies are sent to your browser from a
            website and stored on your device. Tracking technologies also used are
            beacons, tags, and scripts to collect and track information and to
            improve and analyze our Service.
          </p>
          <p>
            You can instruct your browser to refuse all cookies or to indicate when
            a cookie is being sent. However, if you do not accept cookies, you may
            not be able to use some portions of our Service. You can learn more how
            to manage cookies in the{' '}<Link target="_blank" rel="noopener" underline="always" href="https://privacypolicies.com/blog/how-to-delete-cookies/">Browser Cookies Guide</Link>.
          </p>
          <p>Examples of Cookies we use:</p>
            <ul>
              <li>
                <strong>Session Cookies.</strong> We use Session Cookies to operate
                our Service.
              </li>
              <li>
                <strong>Preference Cookies.</strong> We use Preference Cookies to
                remember your preferences and various settings.
              </li>
              <li>
                <strong>Security Cookies.</strong> We use Security Cookies for
                security purposes.
              </li>
            </ul>

        <h3>
          Use of Data
        </h3>

          <p>Caravan uses the collected data for various purposes:</p>
            <ul>
              <li>To provide and maintain the Service</li>
              <li>To notify you about changes to our Service</li>
              <li>
                To allow you to participate in interactive features of our Service
                when you choose to do so
              </li>
              <li>To provide customer care and support</li>
              <li>
                To provide analysis or valuable information so that we can improve the
                Service
              </li>
              <li>To monitor the usage of the Service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>

        <h3>
          Transfer Of Data
        </h3>

          <p>
            Your information, including Personal Data, may be transferred to — and
            maintained on — computers located outside of your state, province,
            country or other governmental jurisdiction where the data protection
            laws may differ than those from your jurisdiction.
          </p>
          <p>
            If you are located outside Canada and choose to provide information to
            us, please note that we transfer the data, including Personal Data, to
            Canada and process it there.
          </p>
          <p>
            Your consent to this Privacy Policy followed by your submission of such
            information represents your agreement to that transfer.
          </p>
          <p>
            Caravan will take all steps reasonably necessary to ensure that your
            data is treated securely and in accordance with this Privacy Policy and
            no transfer of your Personal Data will take place to an organization or
            a country unless there are adequate controls in place including the
            security of your data and other personal information.
          </p>

        <h3>
          Disclosure Of Data
        </h3>
        <h4>
          Legal Requirements
        </h4>

          <p>
            Caravan may disclose your Personal Data in the good faith belief that
            such action is necessary to:
          </p>
          <ul>
            <li>To comply with a legal obligation</li>
            <li>To protect and defend the rights or property of Caravan</li>
            <li>
              To prevent or investigate possible wrongdoing in connection with the
              Service
            </li>
            <li>
              To protect the personal safety of users of the Service or the public
            </li>
            <li>To protect against legal liability</li>
          </ul>

        <h3>
          Security Of Data
        </h3>

          <p>
            The security of your data is important to us, but remember that no
            method of transmission over the Internet, or method of electronic
            storage is 100% secure. While we strive to use commercially acceptable
            means to protect your Personal Data, we cannot guarantee its absolute
            security.
          </p>

        <h3>
          Service Providers
        </h3>

          <p>
            We may employ third party companies and individuals to facilitate our
            Service ("Service Providers"), to provide the Service on our behalf, to
            perform Service-related services or to assist us in analyzing how our
            Service is used.
          </p>
          <p>
            These third parties have access to your Personal Data only to perform
            these tasks on our behalf and are obligated not to disclose or use it
            for any other purpose.
          </p>

        <h3>
          Google Analytics
        </h3>

          <p>
            Our website uses Google Analytics, a web analysis service of Google, Inc.,
            1600 Amphitheatre Parkway, Mountain View, CA 94043 USA, www.google.com
            (“Google Analytics” or “Google”). Google Analytics employs cookies that
            are stored to your computer in order to facilitate an analysis of your use
            of the site. The information generated by these cookies, such as time,
            place and frequency of your visits to our site, including your IP address,
            is transmitted to Google’s location in the US and stored there. Google
            uses this information to analyze your use of our site, to compile reports
            for us on internet activity and to provide other services relating to our
            website. Google may also transfer this information to third parties where
            required to do so by law or where such third parties process this data on
            Google’s behalf. Google states that it will in never associate your IP
            address with other data held by Google. You can prevent cookies from being
            installed by adjusting the settings on your browser software accordingly
            as noted elsewhere in this Privacy Policy. You should be aware, however,
            that by doing so you may not be able to make full use of all the functions
            of our website. Google Analytics also offers a deactivation add-on for
            most current browsers that provides you with more control over what data
            Google can collect on websites you access. The add-on tells the JavaScript
            (ga.js) used by Google Analytics not to transmit any information about
            website visits to Google Analytics. However, the browser deactivation
            add-on offered by Google Analytics does not prevent information from being
            transmitted to us or to other web analysis services we may engage. Google
            Analytics also uses electronic images known as web beacons (sometimes
            called single pixel gifs) and are used along with cookies to compile
            aggregated statistics to analyze how our site is used. You can find
            additional information on how to install the browser add-on referenced
            above at the following link:
            https://tools.google.com/dlpage/gaoptout?hl=en. For the cases in which
            personal data is transferred to the US, Google has self-certified pursuant
            to the EU-US Privacy Shield
            (https://www.privacyshield.gov/EU-US-Framework).
          </p>
        <h3>
          Links To Other Sites
        </h3>

          <p>
            Our Service may contain links to other sites that are not operated by
            us. If you click on a third party link, you will be directed to that
            third party's site. We strongly advise you to review the Privacy Policy
            of every site you visit.
          </p>
          <p>
            We have no control over and assume no responsibility for the content,
            privacy policies or practices of any third party sites or services.
          </p>

        <h3>
          Children's Privacy
        </h3>

          <p>
            Our Service does not address anyone under the age of 18 ("Children").
          </p>
          <p>
            We do not knowingly collect personally identifiable information from
            anyone under the age of 18. If you are a parent or guardian and you are
            aware that your Children has provided us with Personal Data, please
            contact us. If we become aware that we have collected Personal Data from
            children without verification of parental consent, we take steps to
            remove that information from our servers.
          </p>

        <h3>
          Changes To This Privacy Policy
        </h3>

          <p>
            We may update our Privacy Policy from time to time. We will notify you
            of any changes by posting the new Privacy Policy on this page.
          </p>
          <p>
            We will let you know via email and/or a prominent notice on our Service,
            prior to the change becoming effective and update the "effective date"
            at the top of this Privacy Policy.
          </p>
          <p>
            You are advised to review this Privacy Policy periodically for any
            changes. Changes to this Privacy Policy are effective when they are
            posted on this page.
          </p>

        <h3>
          Contact Us
        </h3>

          <p>
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <ul>
            <li>
              By emailing{' '}<Link underline="always" href="mailto:matt@caravanapp.ca" target="_top">matt@caravanapp.ca</Link>.
            </li>
          </ul>
        </Typography>
      </Container>
    </>
  );
}
