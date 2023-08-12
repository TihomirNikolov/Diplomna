import { useEffect, useRef, useState } from "react";
import { Product, ProductReview, authClient, axiosClient, baseProductsURL } from "../../utilities";
import Input, { InputHandle } from "../inputs/Input";
import { useUser } from "../../contexts";
import { Modal } from "../modals";
import { Textarea } from "../inputs";
import { useTranslation } from "react-i18next";
import { validateComment, validateFirstName, validateTitle } from "../../utilities/validations";
import axios from "axios";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProgressBar } from "../utilities";
import { Avatar } from "../account";
import ReviewRating from "./ReviewRating";
import ChooseReviewRating, { ChooseReviewRatingHandle } from "./ChooseReviewRating";


interface Props {
    product: Product | undefined
    onAddedReview: (review: ProductReview) => void,
    onRemoveReview: (review: ProductReview) => void
}

interface AddReviewRequest {
    review: ProductReview,
    productUrl: string
}

interface RemoveReviewRequest {
    review: ProductReview,
    productUrl: string
}

const colors = ['text-red-600', 'text-green-600', 'text-blue-600', 'text-yellow-500', 'text-purple-600',
    'text-indigo-600', 'text-violet-600', 'text-pink-600', 'text-orange-500', 'text-cyan-500']

export default function Reviews(props: Props) {
    const { t } = useTranslation();

    const [averageRating, setAverageRating] = useState<number>(0);

    const nameInput = useRef<InputHandle>(null);
    const titleInput = useRef<InputHandle>(null);
    const commentInput = useRef<InputHandle>(null);
    const ratingInput = useRef<ChooseReviewRatingHandle>(null);

    const { user, roles } = useUser();


    useEffect(() => {
        var sum = 0;
        if (props.product?.reviews != undefined && props.product.reviews.length > 0) {
            for (var review of props.product?.reviews) {
                sum += review.rating;
            }
            setAverageRating(sum / props.product?.reviews.length);
        }

    }, [props.product])

    async function onAddReview() {
        if (!titleInput.current?.isValid || !commentInput.current?.isValid || !nameInput.current?.isValid) {
            titleInput.current?.showValidation();
            commentInput.current?.showValidation();
            nameInput.current?.showValidation();
            return false;
        }

        try {
            var random = Math.floor(Math.random() * colors.length)
            var data: AddReviewRequest = {
                review: {
                    id: "",
                    addedDate: new Date(),
                    comment: commentInput.current.value,
                    title: titleInput.current.value,
                    rating: ratingInput.current?.rating!,
                    name: nameInput.current?.value,
                    avatarColor: colors[random]
                },
                productUrl: props.product?.productUrl ?? ''
            }

            var result = await authClient.post(`${baseProductsURL()}api/products/add-review`, data);
            var dataResult = result.data as ProductReview;
            props.onAddedReview(dataResult);
            return true;
        }
        catch (error) {
            if (axios.isAxiosError(error)) {

            }
            return false;
        }
    }

    async function onRemoveReview(review: ProductReview) {
        try {
            var data: RemoveReviewRequest = {
                review: review,
                productUrl: props.product?.productUrl ?? ""
            }
            var response = await authClient.post(`${baseProductsURL()}api/products/remove-review`, data);
            props.onRemoveReview(review);
        }
        catch (error) {
            if (axios.isAxiosError(error)) {

            }
        }
    }

    return (
        <section className="grid">
            <h1 className="pt-10 pb-4 text-2xl font-bold justify-self-center">{t('reviews')}</h1>
            <div className="grid grid-cols-3">
                <div className="flex flex-col items-center">
                    <div className="flex w-full text-black dark:text-white">
                        <div className="flex flex-col w-full">
                            <div className="flex gap-1">
                                <span>{averageRating.toFixed(1)}/5</span>
                                <ReviewRating rating={averageRating} />
                            </div>
                            <span>{props.product?.reviews.length} ratings</span>
                            <div className="flex items-center gap-1">
                                <span>5 <FontAwesomeIcon icon={['fas', 'star']} className="text-yellow-500" /></span>
                                <ProgressBar className="grow"
                                    percent={(props.product?.reviews.filter(p => p.rating == 5).length! / props.product?.reviews.length!) * 100} />
                                <span>{props.product?.reviews.filter(p => p.rating == 5).length}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span>4 <FontAwesomeIcon icon={['fas', 'star']} className="text-yellow-500" /></span>
                                <ProgressBar className="grow"
                                    percent={(props.product?.reviews.filter(p => p.rating == 4).length! / props.product?.reviews.length!) * 100} />
                                <span>{props.product?.reviews.filter(p => p.rating == 4).length}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span>3 <FontAwesomeIcon icon={['fas', 'star']} className="text-yellow-500" /></span>
                                <ProgressBar className="grow"
                                    percent={(props.product?.reviews.filter(p => p.rating == 3).length! / props.product?.reviews.length!) * 100} />
                                <span>{props.product?.reviews.filter(p => p.rating == 3).length}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span>2 <FontAwesomeIcon icon={['fas', 'star']} className="text-yellow-500" /></span>
                                <ProgressBar className="grow"
                                    percent={(props.product?.reviews.filter(p => p.rating == 2).length! / props.product?.reviews.length!) * 100} />
                                <span>{props.product?.reviews.filter(p => p.rating == 2).length}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span>1 <FontAwesomeIcon icon={['fas', 'star']} className="text-yellow-500" /></span>
                                <ProgressBar className="grow"
                                    percent={(props.product?.reviews.filter(p => p.rating == 1).length! / props.product?.reviews.length!) * 100} />
                                <span>{props.product?.reviews.filter(p => p.rating == 1).length}</span>
                            </div>
                        </div>
                        <div>

                        </div>
                    </div>
                    {user.accessToken == null || user.accessToken == '' ?
                        <div>
                            {t('reviewLoginRequired')}
                        </div>
                        :
                        <Modal submit={onAddReview}>
                            <Modal.Button>
                                <button className="px-5 py-2 w-40 text-white
                                 bg-orange-600 rounded-lg hover:bg-orange-700">
                                    {t('addReview')}
                                </button>
                            </Modal.Button>
                            <Modal.Content>
                                <form className="space-y-5">
                                    <div className="flex gap-3">
                                        <span>Оцени продукта</span>
                                        <ChooseReviewRating ref={ratingInput} />
                                    </div>
                                    <Input ref={nameInput}
                                        type="text" placeholder="Name"
                                        validate={validateFirstName} immediateValdation={true}
                                        validationMessage={t("errorInput.threeCharactersRequired")!} />
                                    <Input ref={titleInput}
                                        type="text" placeholder="Title"
                                        validate={validateTitle} immediateValdation={true}
                                        validationMessage={t("errorInput.threeCharactersRequired")!} />
                                    <Textarea ref={commentInput}
                                        placeholder="Comment"
                                        className="h-64 w-full"
                                        validate={validateComment} immediateValdation={true}
                                        validationMessage={t("errorInput.threeCharactersRequired")!} />
                                </form>
                            </Modal.Content>
                        </Modal>
                    }
                </div>
                <div className="col-span-2">
                    {props.product?.reviews == null || props.product?.reviews.length == 0 ?
                        <div className="flex flex-col gap-2">
                            <span>{t('noReviews')}</span>
                        </div>
                        :
                        <div>
                            {props.product.reviews.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <div className="flex">
                                            <div className="grid grid-cols-2 md:grid-cols-3 w-full">
                                                <div className="flex flex-col items-center justify-center">
                                                    <Avatar letter={item.name[0]} color={item.avatarColor} />
                                                    <h1>{item.name}</h1>
                                                    <h1>{moment(new Date(item.addedDate)).format("DD-MM-YYYY HH:mm:ss")}</h1>
                                                </div>
                                                <div className="flex flex-col md:col-span-2">
                                                    <span>{item.title}</span>
                                                    <ReviewRating rating={item.rating} />
                                                    <span>{item.comment}</span>
                                                </div>
                                            </div>
                                            {roles.filter(r => r == 'Moderator').length > 0 &&
                                                <FontAwesomeIcon icon={['fas', 'x']} className="hover:text-red-600 cursor-pointer"
                                                    onClick={() => onRemoveReview(item)} />
                                            }
                                        </div>
                                        <div className="border-b m-5 border-gray-300" />
                                    </div>
                                )
                            })}
                        </div>
                    }
                </div>
            </div>
        </section>
    )
}