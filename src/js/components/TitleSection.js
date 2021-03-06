import React from 'react';
import { Icon, Button } from '@pearson-components/elements-sdk/build/dist.elements-sdk';


export const TitleSection = ({ back, iconClose, backHandler, text, drawerOpen }) => {

  const backButtonStyles = back ? 'titleSectionHeaderBackButton slideInRightContent' : 'titleSectionHeaderBackButton slideOutLeftContent';
  const titleSpanStyles  = back ? 'titleSectionHeaderTitleSpan slideInRightContent'  : 'titleSectionHeaderTitleSpan slideOutLeftContent';

  return (
    <div className="titleSectionHeader">
      {!back && <span className={drawerOpen ? titleSpanStyles : 'titleSectionHeaderTitleSpan'}>
        <h1 className="titleSectionHeaderTitle">{text.headerTitle}</h1>
      </span>}
      { back && <button className={drawerOpen ? backButtonStyles : 'titleSectionHeaderBackButton'} onClick={backHandler}>
        <Icon name="chevron-back-18"/>
        {text.backButtonText}
      </button>}
      <h1 id="headerTitleSR" className="sr-only">{text.headerTitleSR}</h1>
      <span className="iconWrapper" onClick={iconClose}>
        <Button btnIcon aria-label={text.closeButtonSRText}>
          <Icon name="remove-sm-24"/>
        </Button>
      </span>
    </div>
  )
}
