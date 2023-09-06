import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LanguageIcon from '@mui/icons-material/Language';

// import "./footer.scss";

const Footer: React.FC = () => {
    return (
        <div className="footer">
            <div className="container">
                <hr />
                <div className="bottom">
                    <div className="left">
                        <h2>MovieMaven</h2>
                        <span>© MovieMaven 2023</span>
                    </div>
                    <div className="right">
                        <div className="social">
                            <TwitterIcon aria-label="Twitter" />
                            <FacebookIcon aria-label="Facebook" />
                            <InstagramIcon aria-label="Instagram" />
                            <YouTubeIcon aria-label="YouTube" />
                        </div>
                        <div className="link">
                            <LanguageIcon />
                            <span>English</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Footer;
