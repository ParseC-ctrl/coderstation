import React from 'react';

function PageFooter(props) {
    return (
        <>
            <p className="links">
                <span className="linkItem">友情链接：</span>
                <a
                    href="https://byblog.fun/"
                    target="_blank"
                    rel="noreferrer"
                    className="linkItem"
                >
                    CBY个人博客
                </a>
                <a
                    href="https://github.com/ParseC-ctrl"
                    target="_blank"
                    rel="noreferrer"
                    className="linkItem"
                >
                    CBY的Github
                </a>
            </p>
            <p>© 2023 - CoderStation</p>
            <p><a href='https://beian.miit.gov.cn' target='_blank'>浙ICP备2023006749号-1</a></p>
        </>
    );
}

export default PageFooter;