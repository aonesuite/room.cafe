import React from "react"

import { NavLink } from "react-router-dom"
import { Layout, Row, Col, Button, Dropdown, Menu } from "antd"
import { GlobalOutlined } from "@ant-design/icons"

import { useTranslation } from "react-i18next"
import { langs, changeLanguage} from "../../../locales/i18n"

import { useGlobalState } from "../../contexts/GlobalContext"

import { ReactComponent as LogoSVG } from "../../../assets/icons/Logo.svg"

import "./navbar.scss"

export default function Navigation() {
  const { t } = useTranslation()
  const { state } = useGlobalState()

  const menu = (
    <Menu>
      {
        Object.keys(langs).map((key: string) =>
        <Menu.Item key={key}>
          <Button type="link" onClick={ () => changeLanguage(key) }>{ langs[key] }</Button>
        </Menu.Item>)
      }
    </Menu>
  );

  return(
    <Layout.Header>
      <Row>
        <Col flex="auto">
          <NavLink className="brand" to="/">
            <span>ROOM CAFE</span>
            <LogoSVG width={24} height={24} />
            <sup>Beta</sup>
          </NavLink>
        </Col>

        <Col className="navs">
          <Dropdown overlay={menu} trigger={['click']}>
            <Button className="nav-item" icon={<GlobalOutlined />} type="link" />
          </Dropdown>

          {
            state.signedIn === false &&
            <React.Fragment>
              <Button className="nav-item btn-success">{ t("quick_start") }</Button>
              <Button className="nav-item btn-success">{ t("sign_in") }</Button>
            </React.Fragment>
          }
        </Col>
      </Row>
    </Layout.Header>
  )
}
