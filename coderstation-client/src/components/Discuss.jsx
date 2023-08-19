import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Comment,
  Avatar,
  Button,
  Input,
  Form,
  message,
  List,
  Tooltip,
  Pagination,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import {
  addComment,
  getIssueCommentById,
  getBookCommentById,
} from "../api/comment";
import { getUserById, editUser } from "../api/user";
import { formatDate } from "../utils/tool";
import { updateIssue } from "../api/issue";
import { updateBook } from "../api/book";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

import styles from "../css/Discuss.module.css";
import { updateScoreRankAsync } from "../redux/userSlice";

/**
 * 评论组件
 * @param {*} props
 * @returns
 */
function Discuss(props) {
  // 获取用户信息
  const { userInfo, isLogin } = useSelector((state) => state.user);
  const [value, setValue] = useState("");
  const [commentList, setCommentList] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [pageInfo, setPageInfo] = useState({
    current: 1,
    pageSize: 10,
  });
  const editorRef = useRef();
  const dispatch = useDispatch()

  useEffect(() => {
    async function fetchCommentList() {
      let data = null;
      let result = null;
      // 根据该问答或者书籍 id 获取对应的评论
      if (props.commentType === 1) {
        // 传递过来的是问答 id
        result = await getIssueCommentById(props.targetId, {
          current: pageInfo.current,
          pageSize: pageInfo.pageSize,
        });
      } else if (props.commentType === 2) {
        // 传递过来的是书籍 id
        result = await getBookCommentById(props.targetId, {
          current: pageInfo.current,
          pageSize: pageInfo.pageSize,
        });
      }
      data = result.data;
      // 获取每条评论对应的用户信息
      for (let i = 0; i < data.data.length; i++) {
        const result = await getUserById(data.data[i].userId);
        data.data[i].userInfo = result.data;
      }
      setCommentList(data.data);
      setPageInfo({
        current: data.currentPage,
        pageSize: data.eachPage,
        total: data.count,
      });
    }
    if (props.targetId) {
      fetchCommentList();
    }
  }, [props.targetId, refresh, pageInfo.current, pageInfo.pageSize]);
  // 头像
  let avatar = null;
  if (isLogin) {
    avatar = <Avatar src={userInfo.avatar} alt="用户头像" />;
  } else {
    avatar = <Avatar icon={<UserOutlined />} />;
  }

  async function onSubmit() {
    let newComment = null;
    if (props.commentType === 1) {
      // 新增问答评论
      newComment = editorRef.current.getInstance().getHTML();
    } else if (props.commentType === 2) {
      // 新增书籍评论
      newComment = value;
    }
    const newStr = newComment.replace(/<p>(\s*|<br>)*<\/p>|<br>/g, "");
    if (!newStr.trim()) {
      message.warning("请输入有效评论内容");
      return;
    } else {
      // 用户提交评论
      const result = await addComment({
        userId: userInfo._id,
        bookId: props.bookInfo?._id,
        issueId: props.issueInfo?._id,
        typeId: props.issueInfo
          ? props.issueInfo.typeId
          : props.bookInfo.typeId,
        commentContent: newComment,
        commentType: props.commentType,
      });
      if (result.code === 406) {
        message.error("请勿输入“空”评论");
      } else {
        if (props.commentType === 1) {
          // 问答评论数 +1
          await updateIssue(props.issueInfo._id, {
            commentNumber: ++props.issueInfo.commentNumber,
          });
          // 增加对应用户的积分
          await editUser(userInfo._id, {
            points: userInfo.points + 4,
          });
          message.success("评论添加成功，积分+4");
          editorRef.current.getInstance().setHTML("");
        } else if (props.commentType === 2) {
          // 书籍评论数 + 1
          await updateBook(props.bookInfo._id, {
            commentNumber: ++props.bookInfo.commentNumber,
          });
          // 增加对应用户的积分
          await editUser(userInfo._id, {
            points: userInfo.points + 2,
          });
          message.success("评论添加成功，积分+2");
          setValue("");
        }
        dispatch(updateScoreRankAsync())
        setRefresh(!refresh);
      }
      // 该条问答或者书籍的评论数量加一
    }
  }

  function handlePageChange(current, pageSize) {
    setPageInfo({
      current,
      pageSize,
    });
  }

  const showTotal = (total) => `共 ${total} 项`;
  return (
    <div>
      {/* 评论框 */}
      <Comment
        avatar={avatar}
        content={
          <>
            <Form.Item>
              {props?.commentType === 1 ? (
                <Editor
                  initialValue=""
                  previewStyle="vertical"
                  height="270px"
                  initialEditType="wysiwyg"
                  useCommandShortcut={true}
                  language="zh-CN"
                  ref={editorRef}
                  className="editor"
                />
              ) : (
                <Input.TextArea
                  rows={4}
                  placeholder={isLogin ? "" : "请登录后评论..."}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                disabled={isLogin ? false : true}
                onClick={onSubmit}
              >
                添加评论
              </Button>
            </Form.Item>
          </>
        }
      />
      {/* 评论列表 */}
      {commentList?.length > 0 && (
        <List
          dataSource={commentList}
          header="当前评论"
          itemLayout="horizontal"
          renderItem={function (props) {
            return (
              <Comment
                author={props.userInfo.nickname}
                avatar={<Avatar src={props.userInfo.avatar} />}
                content={
                  <div
                    dangerouslySetInnerHTML={{ __html: props.commentContent }}
                  ></div>
                }
                datetime={
                  <Tooltip title={formatDate(props.commentDate)}>
                    <span>{formatDate(props.commentDate, "year")}</span>
                  </Tooltip>
                }
              />
            );
          }}
        />
      )}
      {/* 分页 */}
      {commentList?.length > 0 ? (
        <div className={styles.paginationContainer}>
          <Pagination
            showQuickJumper
            defaultCurrent={1}
            showTotal={showTotal}
            {...pageInfo}
            onChange={handlePageChange}
          />
        </div>
      ) : (
        <div
          style={{
            fontWeight: "200",
            textAlign: "center",
            margin: "50px",
          }}
        >
          暂无评论
        </div>
      )}
    </div>
  );
}

export default Discuss;
