import './Footer.scss';

export const Footer = () => {
	return (
		<footer className="footer">
			<h3>Layouts</h3>
			<ul className="layout-demo flex-layout" data-size="8">
				<li>UNO</li>
				<li>DOS</li>
				<li>TRES</li>
				<li>CUATRO</li>
				<li>CINCO</li>
				<li>SEIS</li>
				<li>SIETE</li>
				<li>OCHO</li>
			</ul>
			<ul className="layout-demo grid-layout" data-size="8">
				<li>one</li>
				<li>two</li>
				<li>three</li>
				<li>four</li>
				<li>five</li>
				<li>six</li>
				<li>seven</li>
				<li>eight</li>
			</ul>
		</footer>
	);
};

export default Footer;
