import React from "react";
import { connect } from "react-redux";
import { Responsive } from "semantic-ui-react";

import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";
import { fakelogout } from "../../actions";

const Navbar = props => {
  
  const handlelogout = cb => {
		props.fakelogout();
		setTimeout(cb, 100);
	};

	return (
		<div>
			<Responsive
				as={NavbarMobile}
				{...Responsive.onlyMobile}
				logout={handlelogout}
			/>
			<Responsive
				as={NavbarDesktop}
				minWidth={Responsive.onlyTablet.minWidth}
				logout={handlelogout}
			/>
		</div>
	);
};

const mapStateToProps = stateRedux => {
	return {
		isAuthenticated: stateRedux.auth.isAuthenticated
	};
};

export default connect(
	mapStateToProps,
	{ fakelogout }
)(Navbar);
