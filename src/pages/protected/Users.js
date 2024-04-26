import { useState, useContext, useEffect } from 'react';

import { IconContext } from 'react-icons';
import { PiFileMagnifyingGlassFill } from "react-icons/pi";
import { PiPencilSimpleLineFill } from "react-icons/pi";
import { IoTrashBinSharp } from "react-icons/io5";

import styles from './Users.module.css';

import { fetchAllUsers, fetchUserById } from '../../api/api';

import AuthContext from '../../context/AuthContextProvider';
import { AdminMenu } from './AdminMenu';
import { SuspenseSpinner } from '../../modals/SuspenseSpinner';
import ErrorGeneric from '../ErrorGeneric';


export const Users = () => {
  const { loggedInUserData, setAdminModalVisible, setProtectedData } = useContext(AuthContext);
  const token = loggedInUserData.auth_token;

  const [allUsersData, setAllUsersData] = useState([]);

  useEffect(() => {
    async function getAllUsers() {
      try {
        const response = await fetchAllUsers(token);
        setAllUsersData(response);
      } catch (error) {
        console.log("Error", error)
        throw new Error()
      }
    }
    if (token) {
      getAllUsers(); // <-- only fetch users if truthy token
    }
  }, [token]);

  // Apart from getting data to be rendered in the admin modal this function will set the 
  // item type to be viewed or edited e.g. user, album etc... and the type of action e.g. view, edit, 
  async function setUserDataAndEnableAdminModal(token, idOfUser, actionType) {
    const response = await fetchUserById(token, idOfUser);
    console.log(response);
    setProtectedData({
      dataType: "singleUser",
      actionType,
      ...response
    })
    setAdminModalVisible(true);
  }


  return (<main>
    <AdminMenu />
    {token
      ? <div className={styles.usersDiv}>
        {!allUsersData
          ? <SuspenseSpinner />
          : <>
            {allUsersData.length === 0
              ? <h2> No users found</h2>
              : <>
                {allUsersData.map(user =>
                  <li key={user.id} className={styles['single-item']}>
                    <div className={styles['data']}>
                      <p className={styles['data-primary']}><span>{user.id}</span> {user.f_name} {user.l_name} </p>
                      {(user.city || user.country) && <p className={styles['data-secondary']}>{user.city}, {user.country}</p>
                      }
                    </div>
                    <div className={styles['action-btns']}>
                      <IconContext.Provider value={{ className: `${styles.reactIcons}` }}>
                        <button title="View" className={styles.btnRight} onClick={() => setUserDataAndEnableAdminModal(token, user.id, "VIEW")}>
                          <PiFileMagnifyingGlassFill />
                        </button>
                      </IconContext.Provider>
                      <IconContext.Provider value={{ className: `${styles.reactIcons}` }}>
                        <button title="Edit" className={styles.btnRight} onClick={() => setUserDataAndEnableAdminModal(token, user.id, "EDIT")}>
                          <PiPencilSimpleLineFill />
                        </button>
                      </IconContext.Provider>
                      <IconContext.Provider value={{ className: `${styles.reactIcons}` }}>
                        <button title="Delete" className={styles.btnRight} onClick={() => setUserDataAndEnableAdminModal(token, user.id, "DELETE")}>
                          <IoTrashBinSharp />
                        </button>
                      </IconContext.Provider>
                    </div>
                  </li>
                )
                }
              </>
            }
          </>
        }
      </div>
      :
      <ErrorGeneric errMessage="Log in/register to continue" />
    }
  </main>
  )
}
