import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThemeToggle } from "../inputs";
import { useUser } from "../../contexts";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, Popover, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

export default function Profile() {
  const { user, isAdmin, isOwner, isEmployee, logout } = useUser();

  const { t } = useTranslation();

  const navigate = useNavigate();

  async function onLoggedOut() {
    await logout();
    navigate("");
  }

  function isLoggedIn() {
    if (user.accessToken == null || user.accessToken == "") {
      return false;
    }
    return true;
  }

  return (
    <Menu as="div" className="relative">
      <Menu.Button>
        <div className="inline-block cursor-pointer">
          <FontAwesomeIcon
            icon={["fas", "circle-user"]}
            size="2x"
            className="text-blue-400"
          />
        </div>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className="absolute right-0 z-10 mt-2 w-48 cursor-pointer rounded-lg
                                     bg-lightBackground px-2 py-2
                                     text-black shadow-lg dark:bg-gray-700 dark:text-white"
        >
          <div className="flex rounded-lg hover:bg-gray-500 hover:dark:bg-gray-500">
            {!isLoggedIn() ? (
              <Menu.Item>
                <Link to="/login" className="w-full py-1 text-center">
                  {t("signIn")}
                </Link>
              </Menu.Item>
            ) : (
              <Menu.Item>
                <Link to="/account" className="w-full py-1 text-center">
                  {t("account")}
                </Link>
              </Menu.Item>
            )}
          </div>
          <div className="grid grid-flow-col place-items-end items-center rounded-lg px-1 py-1">
            <label>{t("darkTheme")}</label>
            <ThemeToggle />
          </div>
          {isAdmin() && (
            <div className="flex rounded-lg hover:bg-gray-500 hover:dark:bg-gray-500">
              <Menu.Item>
                <Link to="/admin-panel" className="w-full py-1 text-center">
                  {t("adminPanel")}
                </Link>
              </Menu.Item>
            </div>
          )}
          {isOwner() && (
            <div className="flex rounded-lg hover:bg-gray-500 hover:dark:bg-gray-500">
              <Menu.Item>
                <Link to="/owner-panel" className="w-full py-1 text-center">
                  {t("ownerPanel")}
                </Link>
              </Menu.Item>
            </div>
          )}
          {isEmployee() && (
            <div className="flex rounded-lg hover:bg-gray-500 hover:dark:bg-gray-500">
              <Menu.Item>
                <Link
                  to="/employee-panel/new-orders"
                  className="w-full py-1 text-center"
                >
                  {t("employeePanel")}
                </Link>
              </Menu.Item>
            </div>
          )}
          {isLoggedIn() && (
            <div className="flex rounded-lg hover:bg-gray-500 hover:dark:bg-gray-500">
              <Menu.Item>
                <Link
                  to="/logout"
                  className="w-full py-1 text-center"
                  onClick={onLoggedOut}
                >
                  {t("signOut")}
                </Link>
              </Menu.Item>
            </div>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
