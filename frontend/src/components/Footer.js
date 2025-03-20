import React from 'react';
import styles from '../styles/Footer.module.css';

const Footer = () => {
  return (
    // footerScreen
    <footer className={styles.footer}>
      <div className={styles.footerTop_Content}>
        <h1 className={styles.footerTop_Title}>
          <a className={styles.footer_a} href='#' target="_blank">Kakeibo-app</a>
        </h1>
        <div className={styles.footerTop_Nav}>Follow us on SNS.</div>
          <div className={styles.footerTop_SNS}>
            <ul className={styles.css_linkList_FoZ1V}>
              <li>
                <a className={styles.css_link} href="https://x.com/" target="_blank">
                  <span class="undefined icon">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <title>X</title>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.8262 11.8201L2.14738 19.4436H5.10602L10.2182 13.5928L14.7228 19.4448L20.4919 19.4133L13.1776 9.74111L19.4195 2.59115L16.5084 2.55859L11.7934 7.932L7.7595 2.56737L1.79199 2.56089L8.8262 11.8201ZM16.998 17.6887L15.505 17.6841L5.24743 4.25521H6.85341L16.998 17.6887Z" fill="#626267">
                        </path>
                    </svg>
                  </span>
                </a>
              </li>
              <li class="undefined link_item">
                <a className={styles.css_link} href="https://www.facebook.com/" target="_blank">
                  <span class="undefined icon">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <title>Facebook</title>
                        <path d="M21.0538 11.0587C21.0538 5.70997 16.7451 1.375 11.4288 1.375C6.11243 1.375 1.80371 5.70997 1.80371 11.0587C1.80371 15.893 5.32288 19.8989 9.92486 20.6251V13.8579H7.481V11.0587H9.92486V8.92526C9.92486 6.49866 11.3611 5.15769 13.5606 5.15769C14.6133 5.15769 15.7149 5.34683 15.7149 5.34683V7.72993H14.5005C13.3049 7.72993 12.9327 8.47701 12.9327 9.243V11.0587H15.6021L15.1754 13.8579H12.9327V20.6251C17.5347 19.8989 21.0538 15.893 21.0538 11.0587Z" fill="#626267">
                        </path>
                    </svg>
                  </span>
                </a>
              </li>
              <li class="undefined link_item">
                <a className={styles.css_link} href="https://www.instagram.com/" target="_blank">
                  <span class="undefined icon">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <title>Instagram</title>
                        <path d="M11.7139 3.10826C14.2856 3.10826 14.5902 3.11954 15.6016 3.16466C16.5415 3.20602 17.0491 3.36393 17.3875 3.49552C17.8349 3.66847 18.1582 3.87902 18.4928 4.21364C18.8312 4.55202 19.038 4.87161 19.211 5.31902C19.3425 5.6574 19.5005 6.16873 19.5418 7.10492C19.5869 8.12006 19.5982 8.42461 19.5982 10.9925C19.5982 13.5642 19.5869 13.8688 19.5418 14.8802C19.5005 15.8201 19.3425 16.3277 19.211 16.6661C19.038 17.1135 18.8275 17.4368 18.4928 17.7714C18.1545 18.1098 17.8349 18.3166 17.3875 18.4896C17.0491 18.6212 16.5377 18.7791 15.6016 18.8204C14.5864 18.8655 14.2819 18.8768 11.7139 18.8768C9.14224 18.8768 8.83769 18.8655 7.82631 18.8204C6.88636 18.7791 6.37879 18.6212 6.04041 18.4896C5.59299 18.3166 5.26965 18.1061 4.93503 17.7714C4.59665 17.4331 4.38986 17.1135 4.21691 16.6661C4.08532 16.3277 3.92741 15.8164 3.88605 14.8802C3.84093 13.865 3.82965 13.5605 3.82965 10.9925C3.82965 8.42085 3.84093 8.1163 3.88605 7.10492C3.92741 6.16497 4.08532 5.6574 4.21691 5.31902C4.38986 4.87161 4.60041 4.54826 4.93503 4.21364C5.27341 3.87526 5.59299 3.66847 6.04041 3.49552C6.37879 3.36393 6.89012 3.20602 7.82631 3.16466C8.83769 3.11954 9.14224 3.10826 11.7139 3.10826ZM11.7139 1.375C9.10088 1.375 8.77378 1.38628 7.74735 1.4314C6.72469 1.47651 6.02161 1.64195 5.41252 1.87881C4.77712 2.12696 4.23947 2.45406 3.70558 2.99171C3.16793 3.5256 2.84083 4.06325 2.59268 4.6949C2.35581 5.30774 2.19038 6.00706 2.14526 7.02973C2.10015 8.05991 2.08887 8.38701 2.08887 11.0001C2.08887 13.6131 2.10015 13.9402 2.14526 14.9666C2.19038 15.9893 2.35581 16.6924 2.59268 17.3015C2.84083 17.9369 3.16793 18.4745 3.70558 19.0084C4.23947 19.5423 4.77712 19.8732 5.40876 20.1176C6.02161 20.3544 6.72093 20.5199 7.74359 20.565C8.77002 20.6101 9.09712 20.6214 11.7102 20.6214C14.3232 20.6214 14.6503 20.6101 15.6768 20.565C16.6994 20.5199 17.4025 20.3544 18.0116 20.1176C18.6432 19.8732 19.1809 19.5423 19.7148 19.0084C20.2487 18.4745 20.5795 17.9369 20.8239 17.3052C21.0608 16.6924 21.2262 15.9931 21.2713 14.9704C21.3164 13.944 21.3277 13.6169 21.3277 11.0038C21.3277 8.39077 21.3164 8.06367 21.2713 7.03724C21.2262 6.01458 21.0608 5.3115 20.8239 4.70241C20.587 4.06325 20.2599 3.5256 19.7223 2.99171C19.1884 2.45782 18.6507 2.12696 18.0191 1.88257C17.4063 1.6457 16.7069 1.48027 15.6843 1.43516C14.6541 1.38628 14.327 1.375 11.7139 1.375Z" fill="#626267">
                        </path>
                        <path d="M11.7146 6.05469C8.98502 6.05469 6.77051 8.2692 6.77051 10.9988C6.77051 13.7284 8.98502 15.9429 11.7146 15.9429C14.4442 15.9429 16.6588 13.7284 16.6588 10.9988C16.6588 8.2692 14.4442 6.05469 11.7146 6.05469ZM11.7146 14.2059C9.94377 14.2059 8.50753 12.7697 8.50753 10.9988C8.50753 9.22795 9.94377 7.79171 11.7146 7.79171C13.4855 7.79171 14.9217 9.22795 14.9217 10.9988C14.9217 12.7697 13.4855 14.2059 11.7146 14.2059Z" fill="#626267">
                        </path>
                        <path d="M18.0068 5.85934C18.0068 6.4985 17.4879 7.01359 16.8525 7.01359C16.2133 7.01359 15.6982 6.49474 15.6982 5.85934C15.6982 5.22017 16.2171 4.70508 16.8525 4.70508C17.4879 4.70508 18.0068 5.22393 18.0068 5.85934Z" fill="#626267">
                        </path>
                    </svg>
                  </span>
                </a>
              </li>
              <li class="undefined link_item">
                <a className={styles.css_link} href="https://line.me/" target="_blank">
                  <span class="undefined icon">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <title>LINE</title>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M5.7147 20.6251H16.2854C18.6822 20.6251 20.6251 18.6821 20.6251 16.2854V5.7147C20.6251 3.31794 18.6822 1.375 16.2854 1.375H5.7147C3.31794 1.375 1.375 3.31794 1.375 5.7147V16.2854C1.375 18.6821 3.31794 20.6251 5.7147 20.6251ZM11.0008 4.8847C14.5398 4.8847 17.4188 7.22119 17.4188 10.093C17.4188 11.2424 16.9732 12.2775 16.043 13.2975H16.0433C14.6968 14.8473 11.6858 16.7351 11.0007 17.0237C10.3348 17.3043 10.4118 16.8655 10.4423 16.6919L10.4448 16.6777C10.4611 16.5811 10.5364 16.1283 10.5364 16.1283C10.558 15.9644 10.5804 15.7101 10.5157 15.5479C10.4438 15.3693 10.1592 15.2766 9.95025 15.2315C6.86602 14.8238 4.58277 12.6676 4.58277 10.093C4.58277 7.22119 7.46211 4.8847 11.0008 4.8847ZM15.2837 11.7513H13.483H13.4806C13.4129 11.7513 13.358 11.6964 13.358 11.6287V11.6267V11.6266V8.83059V8.83041V8.82777C13.358 8.76009 13.4129 8.70523 13.4806 8.70523H13.483H15.2837C15.3511 8.70523 15.4062 8.76033 15.4062 8.82777V9.28291C15.4062 9.35059 15.3514 9.40545 15.2837 9.40545H14.0583V9.8781H15.2837C15.3511 9.8781 15.4062 9.93327 15.4062 10.0006V10.4558C15.4062 10.5235 15.3514 10.5783 15.2837 10.5783H14.0583V11.051H15.2837C15.3511 11.051 15.4062 11.1061 15.4062 11.1735V11.6287C15.4062 11.6964 15.3514 11.7513 15.2837 11.7513ZM8.73649 11.6287C8.73649 11.6964 8.68162 11.7513 8.61395 11.7513H6.81322H6.81081C6.74313 11.7513 6.68827 11.6964 6.68827 11.6287V11.6267V11.6266V8.82777C6.68827 8.76009 6.74313 8.70523 6.81081 8.70523H7.26596C7.33333 8.70523 7.38849 8.76033 7.38849 8.82777V11.051H8.61395C8.68132 11.051 8.73649 11.1062 8.73649 11.1736V11.6287ZM9.69848 8.70523H9.24334C9.17566 8.70523 9.1208 8.76009 9.1208 8.82777V11.6288C9.1208 11.6965 9.17566 11.7513 9.24334 11.7513H9.69848C9.76616 11.7513 9.82102 11.6965 9.82102 11.6288V8.82777C9.82102 8.76009 9.76622 8.70523 9.69848 8.70523ZM12.3428 8.70523H12.7979C12.8656 8.70523 12.9204 8.76009 12.9204 8.82795V11.629C12.9204 11.6966 12.8656 11.7515 12.7979 11.7515H12.3452C12.3342 11.7515 12.3235 11.7499 12.3132 11.7472L12.3115 11.7467C12.3086 11.746 12.3058 11.745 12.303 11.744L12.2991 11.7426L12.2931 11.74L12.2871 11.7371L12.2836 11.7351L12.2827 11.7346C12.2804 11.7333 12.2781 11.7319 12.2759 11.7304L12.2744 11.7295C12.2625 11.7214 12.2517 11.7111 12.2428 11.6986L10.9597 9.96575V11.6288C10.9597 11.6965 10.9048 11.7514 10.8372 11.7514H10.382C10.3143 11.7514 10.2595 11.6965 10.2595 11.6288V8.82783C10.2595 8.76015 10.3143 8.70529 10.382 8.70529H10.8347L10.8389 8.70553L10.8455 8.70583L10.8521 8.70667L10.8573 8.70745C10.8589 8.70772 10.8604 8.70803 10.8619 8.70838C10.8628 8.70858 10.8637 8.7088 10.8646 8.70902L10.8689 8.7101L10.8764 8.71251L10.8804 8.71395L10.8875 8.71702L10.8914 8.71888C10.8926 8.71945 10.8937 8.72004 10.8948 8.72066C10.8959 8.72129 10.897 8.72194 10.8982 8.72261L10.9019 8.7249C10.9041 8.72634 10.9063 8.72779 10.9084 8.72935L10.9117 8.73182C10.914 8.73356 10.9162 8.73549 10.9184 8.73741L10.9207 8.73952C10.9221 8.74087 10.9235 8.74224 10.9248 8.74364C10.9259 8.74479 10.927 8.74596 10.9281 8.74716L10.9288 8.74806C10.9324 8.75209 10.9358 8.7563 10.9387 8.76075L12.2202 10.4914V8.82777C12.2202 8.76009 12.2751 8.70523 12.3428 8.70523Z" fill="#626267"></path>
                    </svg>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        <div className={styles.footerLeft_NavNest}>Customer Service.
          <div className={styles.footerLeftContainer_NavNest}>
            <ul className={styles.css_footerLeftList_FoZ1V}>
              <li>
                <a className={styles.css_link_VFSq} href="#" target="_blank">よくある質問</a>
              </li>
              <li>
                <a className={styles.css_link_VFSq} href="#" target="_blank">運営方針</a>
              </li>
              <li>
                <a className={styles.css_link_VFSq} href="#" target="_blank">お問い合わせ</a>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.footerRight_TitleContainer}>
          <div className={styles.footerRight_NavTitle}>
            <a className={styles.footerRight_NavTitle_a} href='#' target='_blank'>サービス</a>
          </div>
          <div className={styles.footerRight_NavTitle}>
            <a className={styles.footerRight_NavTitle_a} href='#' target='_blank'>利用方法</a>
          </div>
          <div className={styles.footerRight_NavTitle}>
            <a className={styles.footerRight_NavTitle_a} href='#' target='_blank'>私たちに関して</a>
          </div>
        </div>
        <div className={styles.footerRight_Container}>
          <div className={styles.footerRight_Nav}>
            <a className={styles.footerRight_Nav_a} href='#' target='_blank'>coming soon...</a>
          </div>
          <div className={styles.footerRight_Nav}>
            <a className={styles.footerRight_Nav_a} href='#' target='_blank'>coming soon...</a>
          </div>
          <div className={styles.footerRight_Nav}>
            <a className={styles.footerRight_Nav_a} href='#' target='_blank'>coming soon...</a>
          </div>
          <div className={styles.footerRight_Nav}>
            <a className={styles.footerRight_Nav_a} href='#' target='_blank'>coming soon...</a>
          </div>
          <div className={styles.footerRight_Nav}>
            <a className={styles.footerRight_Nav_a} href='#' target='_blank'>coming soon...</a>
          </div>
          <div className={styles.footerRight_Nav}>
            <a className={styles.footerRight_Nav_a} href='#' target='_blank'>coming soon...</a>
          </div>
          <div className={styles.footerRight_Nav}>
            <a className={styles.footerRight_Nav_a} href='#' target='_blank'>coming soon...</a>
          </div>
          <div className={styles.footerRight_Nav}>
            <a className={styles.footerRight_Nav_a} href='#' target='_blank'>coming soon...</a>
          </div>
          <div className={styles.footerRight_Nav}>
            <a className={styles.footerRight_Nav_a} href='#' target='_blank'>coming soon...</a>
          </div>
        </div>
        <div className={styles.footerRight_Underline}>
        </div>
        <div className={styles.footerEnd_Content}>
          <p className={styles.footerText}>© Copyright All Rights Reserved. Kakeibo-App © 2025.</p>
          <a className={styles.footerLink} href="#">Page Top.</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer