import React from "react";
import { BsInstagram, BsLinkedin, BsTwitterX, BsYoutube } from "react-icons/bs";

import "../assets/css/Footer.css";

const Footer = () => {
  return (
    <div className="foot-container">
      <div className="column">
        <div className="title-brand">
          <span>PLAIT</span>
        </div>
        <div className="references">
          <BsTwitterX color="#FFFFFF" />
          <BsInstagram color="#FFFFFF" />
          <BsYoutube color="#FFFFFF" />
          <BsLinkedin color="#FFFFFF" />
        </div>
      </div>
      <div className="column">
        <div className="col-header">
          <span>Use cases</span>
        </div>
        <div className="col-content">
          <span>UI design</span>
          <span>UX design</span>
          <span>Wireframing</span>
          <span>Diagramming</span>
          <span>Brandstorming</span>
          <span>Online whiteboard</span>
          <span>Team collaboration</span>
        </div>
      </div>

      <div className="column">
        <div className="col-header">
          <span>Explore</span>
        </div>
        <div className="col-content">
          <span>Design</span>
          <span>Prototyping</span>
          <span>Development features</span>
          <span>Design systems</span>
          <span>Collaboration features</span>
          <span>Desing process</span>
          <span>FigJam</span>
        </div>
      </div>

      <div className="column">
        <div className="col-header">
          <span>Resources</span>
        </div>
        <div className="col-content">
          <span>Blog</span>
          <span>Best practices</span>
          <span>Color</span>
          <span>Color wheel</span>
          <span>Support</span>
          <span>Developers</span>
          <span>Resource library</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
