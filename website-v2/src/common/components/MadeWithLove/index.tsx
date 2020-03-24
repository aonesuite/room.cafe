import React from "react"

import { useTranslation } from "react-i18next"

export default function MadeWithLove() {

  const { t } = useTranslation()

  return (
    <React.Fragment>
      <p className="text-muted text-center">
        {"Built with love by the "}
        <a className="text-muted" href="https://room.cafe/">Room.Cafe</a>
        {" team. "}

        <a
          className="text-muted"
          href="https://jinshuju.net/f/2UlDEj"
          target="_blank"
          rel="noopener noreferrer">
          { t("contact") }
        </a>
      </p>
      <p className="text-muted text-center">
        © Copyright 2020 5seconds.info Technologies, Inc. All rights reserved.
      </p>
    </React.Fragment>
  )
}
