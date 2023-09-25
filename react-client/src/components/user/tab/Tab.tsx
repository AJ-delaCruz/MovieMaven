import { MovieType } from "../../../types/movie";
import WatchList from "../watchlist/WatchList";
import Favorites from "../favorite/Favorites";
import RatedMovies from "../rating/RatedMovies";
import { useProfileContext } from "../../../contextAPI/ProfileContext";

const Tab: React.FC<{ favorites: MovieType[], watchlist: MovieType[], ratings: MovieType[] }> = ({ favorites, watchlist, ratings }) => {
    // const [activeTab, setActiveTab] = useState<'favorites' | 'watchlist' | 'ratings' | null>('favorites');
    const { activeTab, setActiveTab } = useProfileContext();

    return (
        <div>
            <div className="profile-navigation">
                <div
                    className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
                    onClick={() => setActiveTab('favorites')}
                >
                    <h2> Favorites</h2>

                </div>
                <div
                    className={`tab ${activeTab === 'watchlist' ? 'active' : ''}`}
                    onClick={() => setActiveTab('watchlist')}
                >
                    <h2> Watchlist</h2>
                </div>

                <div
                    className={`tab ${activeTab === 'ratings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('ratings')}
                >
                    <h2> Ratings</h2>
                </div>
            </div>

            <div className="profile-content">
                {activeTab === 'favorites' && <Favorites movies={favorites} />}
                {activeTab === 'watchlist' && <WatchList movies={watchlist} />}
                {activeTab === 'ratings' && <RatedMovies movies={ratings} />}

            </div>
        </div>
    );
}

export default Tab;