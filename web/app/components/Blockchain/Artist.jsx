import React from "react";
import {PropTypes} from "react";
import {Link} from "react-router";
import Immutable from "immutable";
import Translate from "react-translate-component";
import Trigger from "react-foundation-apps/src/trigger";
import Modal from "react-foundation-apps/src/modal";
import ZfApi from "react-foundation-apps/src/utils/foundation-api";
import ReactScriptLoader from "react-script-loader";
//import Interchange from 'react-foundation-apps/src/interchange';

import AccountStore from "stores/AccountStore"
import LoadingIndicator from "../LoadingIndicator";
import ChainTypes from "../Utility/ChainTypes";
import FormattedAsset from "../Utility/FormattedAsset";
import FormattedPrice from "../Utility/FormattedPrice";
import Box from "../Utility/Box";
import AudioPlayList from "../Utility/AudioPlayList";
import BuyNowModal from "../Modal/BuyNowModal";
import HelpContent from "../Utility/HelpContent";

require("./Artist.scss");


let checkout_js = 'https://checkout.stripe.com/checkout.js';
let public_key = 'pk_test_lYi2Ppe0P7P4no1ti0oXiyzZ';
let idCount = 0;
let stripeHandler = null; //TODO State
let stripePending = false; //TODO State



// TODO - Get artist specfic from DB
let artist = null;
let artists = {};
artists['SNOOP'] = {
    asset_name: 'Snoop Note',
    asset_price: 8.99,
    artist_path: "snoop-dogg",
    product_img_src: "app/assets/images/snoop-dogg.png",
    banner_img_alt: "SNOOP DOGG",
    banner_img_src: "app/assets/images/snoop-dogg-banner.png",
    card1_img_src:   "app/assets/images/snoop-dogg-card-1.png",
    card2_img_src:   "app/assets/images/snoop-dogg-card-2.png",

    cache: [
        {
            trackName: "Ain't No Fun (If the Homies Can't Have None)",
            artistName: "Kurupt, Nate Dogg, Snoop Dogg & Warren G",
            previewUrl: "http://a361.phobos.apple.com/us/r1000/090/Music2/v4/b6/69/f5/b669f560-b208-762c-4d07-757930a6a862/mzaf_5254588950056866413.aac.m4a",
            trackViewUrl: "https://itunes.apple.com/us/album/aint-no-fun-if-homies-cant/id6655669?i=6655661&uo=4"
        },
        {
            trackName: "Young, Wild & Free (feat. Bruno Mars)",
            artistName: "Snoop Dogg & Wiz Khalifa",
            previewUrl: "http://a338.phobos.apple.com/us/r1000/085/Music/46/7e/08/mzm.wajmvhng.aac.p.m4a",
            trackViewUrl: "https://itunes.apple.com/us/album/young-wild-free-feat.-bruno/id480436587?i=480436634&uo=4"
        },
        {
            trackName: "Who Am I (What's My Name)?",
            artistName: "Snoop Dogg",
            previewUrl: "http://a177.phobos.apple.com/us/r1000/084/Music2/v4/7c/b2/f4/7cb2f49b-d436-c087-22c9-36b63ffe28ec/mzaf_5798767578330811935.aac.m4a",
            trackViewUrl: "https://itunes.apple.com/us/album/who-am-i-whats-my-name/id6655669?i=6655657&uo=4"
        },
        {
            trackName: "Gin and Juice",
            artistName: "Snoop Dogg & Dat Nigga Daz",
            previewUrl: "http://a557.phobos.apple.com/us/r1000/114/Music/v4/2c/12/ef/2c12ef42-04f1-28c3-8574-ffc040bc5ea1/mzaf_6317481768815811519.aac.m4a",
            trackViewUrl: "https://itunes.apple.com/us/album/gin-and-juice/id6655669?i=6655647&uo=4"
        },
        {
            trackName: "Drop It Like It's Hot",
            artistName: "Snoop Dogg & Pharrell Williams",
            previewUrl: "http://a187.phobos.apple.com/us/r1000/118/Music/b3/81/f7/mzm.trfluibm.aac.p.m4a",
            trackViewUrl: "https://itunes.apple.com/us/album/drop-it-like-its-hot/id21807343?i=21807356&uo=4"
        },
        {
            trackName: "Winter Wonderland / Here Comes Santa Claus",
            artistName: "Snoop Dogg & Anna Kendrick",
            previewUrl: "http://a1065.phobos.apple.com/us/r1000/031/Music5/v4/71/76/36/7176366b-3c86-c122-3511-fcd0b6cc6968/mzaf_4424772093384573037.plus.aac.p.m4a",
            trackViewUrl: "https://itunes.apple.com/us/album/winter-wonderland-here-comes/id982565603?i=982566430&uo=4"
        },
        {
            trackName: "Murder Was the Case (Death After Visualizing Eternity)",
            artistName: "Snoop Dogg & Dat Nigga Daz",
            previewUrl: "http://a172.phobos.apple.com/us/r1000/072/Music/v4/9b/2f/4d/9b2f4d93-0571-b70e-a668-ceb9f85907b3/mzaf_275259467735498519.aac.m4a",
            trackViewUrl: "https://itunes.apple.com/us/album/murder-was-case-death-after/id6655669?i=6655653&uo=4"
        },
        {
            trackName: "California Roll (feat. Stevie Wonder)",
            artistName: "Snoop Dogg",
            previewUrl: "http://a1118.phobos.apple.com/us/r1000/177/Music3/v4/bb/58/42/bb584244-87f0-5d69-2a5f-bd0ca390f669/mzaf_5559383638478404200.plus.aac.p.m4a",
            trackViewUrl: "https://itunes.apple.com/us/album/california-roll-feat.-stevie/id961256177?i=961256304&uo=4"
        },
        {
            trackName: "Buttons",
            artistName: "The Pussycat Dolls featuring Big Snoop Dogg",
            previewUrl: "http://a985.phobos.apple.com/us/r1000/074/Music/9a/24/af/mzm.clwkbvyf.aac.p.m4a",
            trackViewUrl: "https://itunes.apple.com/us/album/buttons/id137770692?i=137770701&uo=4"
        },
        {
            trackName: "Beautiful (feat. Pharrell & Uncle Charlie Wilson)",
            artistName: "Snoop Dogg",
            previewUrl: "http://a1015.phobos.apple.com/us/r30/Music1/v4/d1/2a/6a/d12a6a26-dc88-9e3d-c6a4-83fa07aa2b0d/mzaf_2092126912916544661.plus.aac.p.m4a",
            trackViewUrl: "https://itunes.apple.com/us/album/beautiful-feat.-pharrell-uncle/id713292736?i=713292791&uo=4"
        },
        /*
         {
         trackName: "California Gurls (feat. Snoop Dogg)",
         artistName: "Katy Perry",
         previewUrl: "http://a1230.phobos.apple.com/us/r30/Music7/v4/a4/aa/d7/a4aad7d4-9b79-bbf5-a66c-8133c6708768/mzaf_3063361571115617819.plus.aac.p.m4a",
         trackViewUrl: "https://itunes.apple.com/us/album/california-gurls-feat.-snoop/id716084282?i=716084621&uo=4"
         },
         */
    ],
    tracks: [ // TODO: Itunes search api (retrieving tracks) not implmented in react
        "snoop dogg  beautiful",
        "snoop dogg  woof!",
        "snoop dogg  hell yeah",
        "snoop dogg  california gurls",
        "snoop dogg  drop it like it's hot",
        "snoop dogg  i wanna love you",
        "snoop dogg  buttons",
        "snoop dogg  holidae in",
    ],
};
artists['TTT'] = {
    asset_name: 'Brubeck Coin',
    asset_price: 9.99,
    artist_path: "dave-brubeck",
    banner_img_alt: "DAVE BRUBECK",
    banner_img_src: "app/assets/images/dave-brubeck.png",
    product_img_src: "app/assets/images/dave-brubeck.png",

    cache: [
        {trackName:"Unsquare Dance", artistName:"The Dave Brubeck Quartet", previewUrl:"http://a569.phobos.apple.com/us/r1000/071/Music/v4/73/b5/af/73b5af52-eecb-5b73-ae15-fdd722d99625/mzaf_5656371987025885704.aac.m4a", trackViewUrl:"https://itunes.apple.com/us/album/unsquare-dance/id572049729?i=572049817&uo=4"},
        {trackName:"Strange Meadow Lark", artistName:"The Dave Brubeck Quartet", previewUrl:"http://a282.phobos.apple.com/us/r1000/079/Music/95/9d/23/mzm.icdyuvef.aac.p.m4a", trackViewUrl:"https://itunes.apple.com/us/album/strange-meadow-lark/id316475425?i=316475541&uo=4"},
        {trackName:"Blue Rondo a la Turk", artistName:"The Dave Brubeck Quartet", previewUrl:"http://a86.phobos.apple.com/us/r1000/090/Music/a9/2c/a5/mzm.somapedp.aac.p.m4a", trackViewUrl:"https://itunes.apple.com/us/album/blue-rondo-a-la-turk/id316475425?i=316475503&uo=4"},
        {trackName:"Audrey", artistName:"Dave Brubeck & The Dave Brubeck Quartet", previewUrl:"http://a482.phobos.apple.com/us/r1000/065/Music/af/95/5d/mzm.dhakozmf.aac.p.m4a", trackViewUrl:"https://itunes.apple.com/us/album/audrey/id197541949?i=197543560&uo=4"},
        {trackName:"Take Five", artistName:"Dave Brubeck", previewUrl:"http://a82.phobos.apple.com/us/r1000/106/Music/c4/5e/95/mzm.fhlwysph.aac.p.m4a", trackViewUrl:"https://itunes.apple.com/us/album/take-five/id157427923?i=157427932&uo=4"},
        {trackName:"Summer Song", artistName:"Louis Armstrong", previewUrl:"http://a44.phobos.apple.com/us/r1000/109/Music/a3/e4/f0/mzm.jzlqmetm.aac.p.m4a", trackViewUrl:"https://itunes.apple.com/us/album/summer-song/id197541949?i=197548956&uo=4"},
        {trackName:"Invention", artistName:"Dave Brubeck", previewUrl:"http://a369.phobos.apple.com/us/r1000/060/Music/68/d1/d4/mzm.zxzuxisl.aac.p.m4a", trackViewUrl:"https://itunes.apple.com/us/album/invention/id208788958?i=208788980&uo=4"},
        {trackName:"Dorian Dance", artistName:"Dave Brubeck", previewUrl:"http://a414.phobos.apple.com/us/r1000/080/Music/94/e5/a1/mzm.zhipujes.aac.p.m4a", trackViewUrl:"https://itunes.apple.com/us/album/dorian-dance/id208788958?i=208788960&uo=4"},
        {trackName:"Georgia On My Mind", artistName:"Dave Brubeck", previewUrl:"http://a1270.phobos.apple.com/us/r1000/089/Music/05/c7/da/mzm.masruzhz.aac.p.m4a", trackViewUrl:"https://itunes.apple.com/us/album/georgia-on-my-mind/id321598311?i=321598326&uo=4"},
    ],
    tracks: [],
};


class Artist extends React.Component {

    constructor( props ) {
        super(props);

        this.state = { amount: 1 }
    }

    static contextTypes = {
        router: React.PropTypes.func.isRequired
    };

    static propTypes = {
        asset: ChainTypes.ChainAsset.isRequired,
        details: PropTypes.object.isRequired,
     };

     static defaultProps = {
         details: ''
     };


    renderHeader() {
        //let style={maxWidth:"1000px", margin:"auto", width:"100%", height:"auto"};
        let style={margin:"auto", width:"100%", height:"auto"};
        return (
             <Box className="aboutBox">
                 <img src={artist.banner_img_src} alt={artist.banner_img_alt} style={style}/>
{/*
                 <Interchange>
                     <img media="small" src={artist.banner_img_src} alt={artist.banner_img_alt} style={style}/>
                     <img media="medium" src={artist.banner_img_src} alt={artist.banner_img_alt} style={style}/>
                     <img media="large" src={artist.banner_img_src} alt={artist.banner_img_alt} style={style}/>
 I               </Interchange>
*/}
            </Box>
        );
    }

    renderArtistContent(artist_path, section) {
        return (<HelpContent path={"artists/" + artist_path} alt_path="artist/Artist" section={section}/>)
    }

    // TODO: Retrieve Artist info
    renderBiography() {
        return (
            <Box className="biographyBox" accordian="true" header="Biography">
                <div className="grid-block" style={{overflow:"visible"}}>

                    <div className="large-2 medium-4 small-6 grid-block" style={{overflow:"visible"}}>
                        <div>
                            <h5><Translate content="explorer.artist.birth_name"/>:   </h5>  {this.renderArtistContent(artist.artist_path, 'birthName')}
                            <h5><Translate content="explorer.artist.born"/>:         </h5>  {this.renderArtistContent(artist.artist_path, 'born')}
                            <h5><Translate content="explorer.artist.genre"/>:        </h5>  {this.renderArtistContent(artist.artist_path, 'genre')}
                            <h5><Translate content="explorer.artist.years_active"/>: </h5>  {this.renderArtistContent(artist.artist_path, 'yearsActive')}
                        </div>
                    </div>

                    <div className="large-10 medium-8 small-6 grid-block" style={{overflow:"visible"}}>
                        {this.renderArtistContent(artist.artist_path, 'biography')}
                    </div>
                </div>
            </Box>
        );
    }

    // TODO: Retrieve Artist info
    renderTracks() {
        return (
            <Box className='Box trackBox' header="Tracks">
                <AudioPlayList cache={artist.cache}/>
            </Box>
        );
    }

    renderArtistCard(image, fgColor, bgColor, title, cardType, content, footer) {
        //<div className="grid-block card-section" style={{color: fgColor, backgroundColor: bgColor}}> </div>
        return (
            <div className="card" style={{borderRadius:"4px", boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.8)", padding:"0 16px", color: fgColor, backgroundColor: bgColor}}>
                <img src={image} style={{borderStyle: "solid", borderWidth: "16px 0 0 0", borderColor: bgColor}}/>
                <div className="card-divider" style={{color: fgColor, backgroundColor: bgColor, pading:"0 16px"}}>
                    <div className="grid-block">
                        <span className="grid-content">{title}</span>
                        <span className="grid-content align-right shrink"
                              style={{backgroundColor: fgColor, color: bgColor, padding:"2px 8px", borderStyle: "inset", borderWidth: "1px", borderColor: "black"}}>
                            {cardType}</span>
                    </div>
                    {content}
                    {footer}
                </div>
            </div>
        );
    }

    renderCardContent(items) {
        return (
            <div className="grid-block">
                <ul style={{fontSize: "14px", margin: "8px 32px"}}>
                    <li>{items[0]}</li>
                    <li>{items[1]}</li>
                    <li>{items[2]}</li>
                </ul>
            </div>
        );
    }
    renderCardFooter(asset_price) {
        return (
            <div className="grid-block">
                <span className="grid-content"> {asset_price}</span>
                <span className="grid-content shrink align-right">{this.renderBuyNowButton()}</span>
            </div>
        );
    }
    renderArtistCards() {
        let asset = this.props.asset.toJS();
        /*
        let currentSupply = (asset.dynamic) ? (
            <div>
                <span className='subheader'>  <Translate content="explorer.asset.summary.current_supply"/> : </span>
                <span> <FormattedAsset amount={asset.dynamic.current_supply} asset={asset.id}/> </span>
            </div>
        ) : (<tr> </tr>);
        */

        let content1 = this.renderCardContent(['Backstage Passes', 'Birthday Parties','Love Letters']);
        let content2 = this.renderCardContent(['Music Discounts', 'Birthday Cards','Form Letters']);
        let footer1= this.renderCardFooter(artist.asset_price*1.5);
        let footer2= this.renderCardFooter(artist.asset_price);

        return (
            <Box header= {asset.symbol}>
                <div className="grid-block">

                    <div className="large-4 medium-6 grid-content" style={{overflow:"visible"}}>
                        {this.renderArtistCard(artist.card2_img_src, "gold", "#733", artist.asset_name, "gold", content1, footer1)}
                    </div>

                    <div className="large-4 medium-6 grid-content" style={{overflow:"visible"}}>
                        {this.renderArtistCard(artist.card1_img_src, "silver", "#337", artist.asset_name, "silver", content2, footer2)}
                    </div>
                </div>

            </Box>
        );
    }

    /*
    renderArtistSummary() {
        let asset = this.props.asset.toJS();
        let dynamic = asset.dynamic;

        let currentSupply = (dynamic) ? (
            <div>
                <span className='subheader'>  <Translate content="explorer.asset.summary.current_supply"/> : </span>
                <span> <FormattedAsset amount={dynamic.current_supply} asset={asset.id}/> </span>
            </div>
        ) : (<tr> </tr>);

        return (
            <Box header= {asset.symbol}>
                <div className="grid-block">
                    <div className="small-8 grid-content">
                        <br/>
                        {this.renderArtistContent(artist.artist_path, 'benefits')}
                        <br/>
                        <div className="table key-value-table">
                            <div>
                                <span> {this.renderBuyNowButton()} </span>
                                <span> {asset_price} per {artist.asset_name} </span>
                            </div>

                            {currentSupply}
                        </div>
                        <br/>
                    </div>

                    <div className="small-4 grid-content" style={{overflow:"visible"}}>
                        {this.renderArtistCard(artist.card_img_src, "yellow", "#337")}
                    </div>
                </div>

            </Box>
        );
    }
    */

    userAccount() {
        let myAccounts = AccountStore.getMyAccounts();
        if (myAccounts.length == 0)
            return 'UNKNOWN';
        return myAccounts[0];
    }

    getBuyNowModalId() {
        return "buy_modal_" + this.props.asset.get('symbol');
    }

    renderBuyNowButton() {

        if (stripePending) { // If someone already trying to purchase...
            return (<LoadingIndicator type="circle"/>);
        }

        let modal_id = this.getBuyNowModalId();
        return (
            <Trigger open={modal_id}>
                <button className="button"><Translate content="explorer.artist.buy_now"/></button>
            </Trigger>
        );
    }

    renderBuyNowModal() {
        let asset = this.props.asset.toJS();
        let modal_id = this.getBuyNowModalId();
        return (
            <Modal id={modal_id} overlay={true}>
                <Trigger close=''>
                    <a href="#" className="close-button">&times;</a>
                </Trigger>
                <br/>
                <div className="grid-block vertical">
                    <BuyNowModal
                        asset_symbol={asset.symbol}
                        asset_name={artist.asset_name}
                        price={artist.asset_price}
                        amount={this.state.amount}
                        amount_change = {this.amountChange.bind(this)}
                        onSubmit = {this.amountSet.bind(this)}
                        modal_id={modal_id}
                    />
                </div>
            </Modal>
        );
    }

    amountChange(e) {
        let amount = e.target.value.replace(/,/g, "");
        this.setState( {amount:parseInt(amount, 10)} );
    }


    __getScriptLoaderID() {
        return 'id' + idCount++;
    }
    componentDidMount() {
        let loader = ReactScriptLoader.ReactScriptLoader;
        loader.componentDidMount(this.__getScriptLoaderID(), this, checkout_js);
        console.log('componentDidMount done');

    }
    componentWillUnmount() {
        let loader = ReactScriptLoader.ReactScriptLoader;
        loader.componentWillUnmount(this.__getScriptLoaderID(), checkout_js);
        console.log('componentWillUnmount done');

        // Close Checkout on page navigation
        if (stripeHandler) {
            stripeHandler.close();
        }
    }

    onScriptLoaded() {
        console.log('onScriptLoaded');

        //setTimeout(this.onScriptLoaded2.bind(this), 15000); } onScriptLoaded2() {

        // Initialize the Stripe stripeHandler on the first onScriptLoaded call.
        // This stripeHandler is shared by all StripeButtons on the page.
        stripeHandler = StripeCheckout.configure({
            token: this.purchaseComplete.bind(this),
            key: public_key,
            name: 'Muse',
            locale: 'auto',
            label: 'pay',
            allowRememberMe: true,
            bitcoin: true,
        });

        if (stripePending) { // If someone already trying to purchase...
            stripePending = false;
            this.amountSet(0);
        }
    }
    onScriptError() {
        alert('onScriptError');
        console.log('onScriptError');
        //this.hideLoadingDialog();
        //ReactStripeCheckout.scriptDidError = true;
        //this.props.onScriptError &&
        //this.props.onScriptError.apply(this);
    }

    amountSet(e) {
        //ZfApi.publish(purchase_id, "open");

        // 4242 4242 4242 4242  Test VISA
        // 5555 5555 5555 4444  Test MasterCard
        // 4000 0000 0000 0101  Will fail based upon an invalid CVC
        // 4000 0000 0000 0002  Will be declined (as if there were insufficient funds)
        // 4000 0000 0000 0069  Will be declined as an expired card
        // 4000 0000 0000 0119  Will be declined for a generic processing error
        /*
         And you can trigger declines by using an invalid month value, a year in the past,
         or a two-digit CVC number (correct numbers are three or four digits long).
         Providing a non-integer amount for the charge will trigger an invalid amount failure,
         */

        let modal_id = this.getBuyNowModalId();
        ZfApi.publish(modal_id, "close");

        if (!stripeHandler) { // Not ready
            stripePending = true;
            return;
        }

        let totalCents = this.state.amount * artist.asset_price * 100;


        // Open Checkout with further options
        stripeHandler.open({
            image: artist.product_img_src,
            description: '' + this.state.amount + " " + artist.asset_name + "(s) at " + artist.asset_price,
            amount: totalCents,
        });
        //e.preventDefault();
    }


    purchaseComplete(token) {
        console.log("-- Artist.purchaseComplete -->", token, this.state, this.props.asset.get("symbol"));
        // Use the token to create the charge with a server-side script.
        // You can access the token ID with `token.id`

        const account = this.userAccount();
        const asset_symbol = this.props.asset.get("symbol");
        const total = this.state.amount * artist.asset_price;
        fetch("http://cnx.rocks/api/v1/stripe/purchase", {
        //fetch("http://localhost:3000/api/v1/stripe/purchase", {
            method: 'post',
            mode: 'cors',
            headers: {
                "Accept": "application/json",
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                "purchase": {
                    "to_account": account,
                    "asset_symbol": asset_symbol,
                    "asset_amount": this.state.amount,
                    "currency": "usd",
                    "total": total * 100,
                    "stripe_token": token.id
                }
            })
        }).then(r => r.json()).then(result => {
            if (result.error) {
                console.error('faucet api error at stripe/purchase: ', error);
                alert("Your purchase couldn't be complete at this time due to server error");
            }
            else {
                console.log("-- purchase complete -->", account, this.state.amount, asset_symbol, total);
                alert(`${account} has purchased ${this.state.amount} ${asset_symbol} for ${total} USD with ${token.card.brand} **** **** **** ${token.card.last4}`);
            }
        }).catch(error => {
            console.error('faucet api error at stripe/purchase: ', error);
            alert("Your purchase couldn't be complete at this time due to server error");
        });

        /*
        console.log(token);
        console.log('card.id', token.card.id);
        console.log('card.brand', token.card.brand);
        console.log('card.last4', token.card.last4);
        console.log('card.exp_month', token.card.exp_month);
        console.log('card.exp_year', token.card.exp_year);
        console.log('card.cvc_check', token.card.cvc_check);
        console.log('email', token.email);
        console.log('id', token.id);
        console.log('verification_allowed', token.verification_allowed);
        */

        //this.context.router.transitionTo("account-overview", {account_name: this.userAccount() });
    }



    //<button onClick={this.f.bind(this)}>Click</button>

    render() {
        let asset_symbol = this.props.asset.get("symbol");
        artist = artists[asset_symbol];
        if (!artist) return <div>Could not find artist for {asset_symbol}</div> //TODO Handle error

        //<div className="grid-block page-layout vertical medium-horizontal">
        return (
            <div className="grid-block page-layout vertical">
              <div className="grid-block vertical" style={{overflow: "visible"}}>
                <div>

                    {this.renderHeader()}

                    <div className="vertical small-horizontal grid-block">
                        <div className="grid-content">
                            {this.renderArtistCards()}
                        </div>
                        <div className="grid-content" style={{overflow:"visible"}}>
                            {this.renderTracks()}
                        </div>
                    </div>

                    {this.renderBiography()}

                    {this.renderBuyNowModal()}

                    <br/>

                    <Box accordian="true" collapsed="true" className='Flat' header='Details'>
                        <div>
                            {this.props.details}
                        </div>
                    </Box>
                </div>
              </div>
            </div>
        );
    }
}

export default Artist;

//outfold armpit pottage crine spayard downily sudamen stylops loka knubbly heartly tikker warwolf ruttee teioid decern
