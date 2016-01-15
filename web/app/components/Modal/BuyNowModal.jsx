import React from "react";
import Modal from "react-foundation-apps/src/modal";
import Trigger from "react-foundation-apps/src/trigger";
import Translate from "react-translate-component";
import utils from "common/utils";
import counterpart from "counterpart";
import classNames from "classnames";
import BindToChainState from "../Utility/BindToChainState";
import LoadingIndicator from "../LoadingIndicator";

@BindToChainState({keep_updating:true})
class BuyNowModal extends React.Component {

    /*
    constructor( props ) {
        super(props);
    }
    */

    static propTypes = {
        asset_name: React.PropTypes.string.isRequired,
        asset_symbol: React.PropTypes.string.isRequired,
        amount: React.PropTypes.number.isRequired,
        price: React.PropTypes.number.isRequired,
        modal_id: React.PropTypes.string.isRequired,
        amount_change: React.PropTypes.func.isRequired,
        onSubmit: React.PropTypes.func.isRequired,
    };

    isValid() {
        return this.props.price > 0 && this.props.amount > 0;
    }

    onSubmit(e) {
        this.props.onSubmit(e);
        //ZfApi.publish(this.props.modal_id, "close");
    }

    render() {
        //let precision = utils.get_asset_precision(asset.get("precision"));

        let amount = this.props.amount;
        let price = this.props.price;
        let total = amount * price;

        let valid = this.isValid();
        let buttonClass = classNames("button", {disabled: !valid});

        return (
            <form className="grid-block vertical full-width-content">
                <div className="grid-container">
                    <div className="content-block">
                        <h3> <Translate content="modal.buy_now.purchase"/> {this.props.asset_name} ({this.props.asset_symbol})</h3>
                    </div>

                    <div className="grid-block no-padding buy-sell-row bottom-row">
                        <div className="grid-block small-3 no-margin no-overflow buy-sell-label">
                            <Translate content="modal.buy_now.amount"/>
                        </div>
                        <div className="grid-block small-6 no-margin no-overflow buy-sell-input">
                            <input type="number" id="buyAmount" value={amount} onChange={this.props.amount_change} autoComplete="off" placeholder="1"/>
                        </div>
                        <div className="grid-block small-3 no-margin no-overflow buy-sell-box">
                            {this.props.asset_symbol}
                        </div>
                    </div>

                    <div className="grid-block no-padding buy-sell-row bottom-row">
                        <div className="grid-block small-3 no-margin no-overflow buy-sell-label">
                            <Translate content="modal.buy_now.price"/>
                        </div>
                        <div className="grid-block small-6 no-margin no-overflow buy-sell-input">
                            <input type="text" placeholder={price} disabled='true'/>
                        </div>
                        <div className="grid-block small-3 no-margin no-overflow buy-sell-box">
                            {'USD / ' + this.props.asset_symbol}
                        </div>
                    </div>

                    <div className="grid-block no-padding buy-sell-row bottom-row">
                        <div className="grid-block small-3 no-margin no-overflow buy-sell-label">
                            <Translate content="modal.buy_now.total"/>
                        </div>
                        <div className="grid-block small-6 no-margin no-overflow buy-sell-input">
                            <input type="text" placeholder={total} disabled='true'/>
                        </div>
                        <div className="grid-block small-3 no-margin no-overflow buy-sell-box">
                            {'USD'}
                        </div>
                    </div>

                    <br/>

                    <div className="content-block">
                        <input type="submit" className={buttonClass}
                               onClick={this.onSubmit.bind(this)}
                               value={counterpart.translate("modal.buy_now.submit")}/>
                        <Trigger close={this.props.modal_id}>
                            <button className="secondary button"><Translate content="account.perm.cancel"/></button>
                        </Trigger>
                    </div>
                </div>
            </form>
        );
    }
}

export default BuyNowModal
