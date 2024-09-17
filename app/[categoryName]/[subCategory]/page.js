"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import moment from "moment";
// import { Helmet, HelmetProvider } from "react-helmet-async";

import { useParams } from "next/navigation";
import Layout from "@/app/components/layout";
import { OverlayLoading, StarRating } from "@/app/components/ui";
import { Helmet } from "react-helmet-async";
import HelmetWrapper from "@/app/components/HelmetWrapper";
import {
  useGetSingleBlogQuery,
  useCreateCommentMutation,
} from "@/redux/services/blogService";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
// import required modules
import { Keyboard, Pagination, Navigation } from "swiper/modules";

export default function BlogView() {
  const params = useParams();
  const { subCategory } = params;
  const [currentUrl, setCurrentUrl] = useState("");
  const { isLoading, data } = useGetSingleBlogQuery(subCategory);
  console.log("blog detail data...", data);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: "",
  });
  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [saveData, response] = useCreateCommentMutation();
  const onSubmitForm = (e) => {
    e.preventDefault();
    saveData({ formData, id: data?.data?.id });
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href); // Get the full URL
    }
  }, []);

  const screenshotsArray = data?.data?.images.map(
    (image) => `${process.env.NEXT_PUBLIC_BASE_URL}/${image.image_path}`
  );
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: data?.data?.software_name,
      url: `https://sgetintopc.com/${data?.data?.category?.slug}/${data?.data?.slug}`,
      version: data?.data?.software_version,
      description: data?.data?.software_version,
      image: data?.data?.software_image,
      screenshot: screenshotsArray, // Mapping screenshots from the images array
      applicationCategory: data?.data?.application_category,
      operatingSystem: data?.data?.operating_system,
      datePublished: data?.data?.date_published,
      dateModified: data?.data?.date_modified,
      publisher: {
        "@type": "Organization",
        name: data?.data?.publisher_name,
        url: "https://sgetintopc.com",
      },
      offers: {
        "@type": "Offer",
        price: data?.data?.price.split(" ")[0],
        priceCurrency: data?.data?.price.split(" ")[1],
      },
      aggregateRating: {
        "@type": "AggregateRating",
        reviewCount: data?.data?.review_count,
        bestRating: 5,
        ratingValue: data?.data?.rating_value,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "Thing",
            "@id": `https://sgetintopc.com/${data?.data?.category?.slug}/${data?.data?.slug}`,
            name: `${data?.data?.operating_system}`,
          },
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      datePublished: data?.data?.date_published,
      description: data?.data?.software_description,
      headline: data?.data?.title,
      image: screenshotsArray,
      dateModified: data?.data?.date_modified,
      isAccessibleForFree: "http://schema.org/True",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://sgetintopc.com/${data?.data?.category?.slug}/${data?.data?.slug}`,
      },
      author: {
        "@type": "Person",
        name: data?.data?.publisher_name,
        url: "https://www.sgetintopc.com",
      },
      publisher: {
        "@type": "Organization",
        name: "SGetInToPC",
        logo: {
          "@type": "ImageObject",
          url: "./images/zeezfaveicon.png",
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      url: "https://sgetintopc.com",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate:
            "https://sgetintopc.comsearch?query={search_term_string}",
        },
        "query-input": {
          "@type": "PropertyValueSpecification",
          valueRequired: "http://schema.org/True",
          valueName: "search_term_string",
        },
      },
    },
  ];

  return (
    <HelmetWrapper>
      <Helmet>
        <title>{data?.data?.title}</title>
        <meta name="description" content={data?.data?.software_description} />
        {/* <meta
          name="keywords"
          content={post.keywords.join(
            `${data?.data?.title} , ${data?.data?.software_description}`
          )}
        /> */}
        <link rel="canonical" href={`${currentUrl}`} />
        <meta
          property="og:image"
          content={data?.data?.software_image || "Default OG Image URL"}
        />
        <meta property="og:url" content={currentUrl || "Default OG URL"} />
        <meta
          property="og:title"
          content={data?.data?.title || "Default OG Title"}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              datePublished: data?.datePublished || "2024-08-27",
              description:
                data?.data?.software_description || "Default description",
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": currentUrl || "https://default-url.com",
              },
              headline: data?.data?.title || "Default Headline",
              image: data?.data?.software_image || [
                "https://default-image-url.com/image.jpg",
              ],
              dateModified: data?.data?.updated_at || "2024-04-26",
              author: [
                {
                  "@type": "Person",
                  name: data?.data?.publisher_name || "Default Author",
                },
              ],
              publisher: {
                "@type": "Organization",
                name: "SGetInToPC",
                logo: {
                  "@type": "ImageObject",
                  url: "https://crackswall.vercel.app/logo.png",
                },
              },
              isAccessibleForFree: true,
            }),
          }}
        />
      </Helmet>
      <main className="w-full">
        {!isLoading && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
        <Layout
          title={data?.data ? `${data?.data?.title}` : "-"}
          // title={
          //   data?.data
          //     ? `${data?.data?.software_name} ${data?.data?.software_version}`
          //     : "-"
          // }
        >
          <div className="margins min-h-[730px]">
            {isLoading ? (
              <OverlayLoading />
            ) : (
              <div className="flex gap-6 md:flex-row flex-col mt-10">
                <div className="flex flex-col flex-1 gap-6 text-3xl text-black font-semibold">
                  <div className="flex flex-col gap-3 bg-white rounded-lg border border-solid border-[#ebebeb] p-5">
                    <h2 className="font-sans text-4xl text-[#2b373a] font-semibold">
                      {/* {data?.data?.software_name} {data?.data?.software_version} */}
                      {data?.data ? `${data?.data?.title} ` : "-"}
                    </h2>
                    <div className="text-sm text-[#666] font-normal">
                      {data?.data?.software_description}{" "}
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-center">
                        {data?.data?.images?.length ? (
                          <Swiper
                            slidesPerView={1}
                            spaceBetween={30}
                            keyboard={{
                              enabled: true,
                            }}
                            pagination={{
                              clickable: true,
                            }}
                            navigation={true}
                            modules={[Keyboard, Navigation]}
                            className="mySwiper"
                          >
                            {data?.data?.images?.map((item, index) => (
                              <SwiperSlide key={index}>
                                <div
                                  className="bgImage"
                                  style={{
                                    backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_URL}/${item.image_path})`,
                                  }}
                                ></div>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                        ) : null}
                      </div>

                      <div className="prose prose-lg mx-auto my-8">
                        <div
                          className="blog-content"
                          dangerouslySetInnerHTML={{
                            __html: data?.data?.detail,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col bg-white rounded-lg border border-solid border-[#ebebeb] p-5 gap-8 mb-10">
                    <h2 className="text-2xl font-semibold text-[#2b373a]">
                      Comments
                    </h2>
                    <div className="flex flex-col">
                      <h3 className="text-[#2b373a] text-xl font-medium mb-3">
                        Leave a comment
                      </h3>
                      <p className="text-[#666] text-base font-normal mb-8">
                        Your email address will not be published. Required
                        fields are marked *
                      </p>
                      <form
                        onSubmit={onSubmitForm}
                        className="flex flex-col w-full gap-4"
                      >
                        <div className="w-full grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4">
                          <div className="flex flex-col w-full gap-1">
                            <label className="text-sm text-[#666] font-medium ">
                              Name *
                            </label>
                            <input
                              type="text"
                              name="name"
                              required
                              placeholder="Name"
                              value={formData.name}
                              onChange={handleInput}
                              className="text-base font-normal bg-transparent border border-solid border-[#ebebeb] rounded p-2 focus:border-teal-600 anim"
                            />
                          </div>
                          <div className="flex flex-col w-full gap-1">
                            <label className="text-sm text-[#666] font-medium ">
                              Email *
                            </label>
                            <input
                              type="email"
                              name="email"
                              required
                              placeholder="Email"
                              value={formData.email}
                              onChange={handleInput}
                              className="text-base font-normal bg-transparent border border-solid border-[#ebebeb] rounded p-2 focus:border-teal-600 anim"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col w-full gap-1">
                          <label className="text-sm text-[#666] font-medium ">
                            Message *
                          </label>
                          <textarea
                            type="text"
                            name="comment"
                            required
                            value={formData.comment}
                            onChange={handleInput}
                            placeholder="Write your comment here..."
                            className="text-base font-normal bg-transparent border border-solid border-[#ebebeb] rounded p-2 focus:border-teal-600 anim min-h-[200px] max-h-[200px]"
                          />
                        </div>
                        <input
                          type="submit"
                          value={
                            response.isLoading ? "Loading..." : "Post Comment"
                          }
                          className="buttonPrimary !p-3 !px-5 font-semibold text-2xl !w-max !bg-teal-700"
                        />
                        {/* Post Comment */}
                        {/* </button>
                      <input
                    type="submit"
                    value={data.isLoading ? "Loading..." : "Criar"}
                    className="btn button"
                  /> */}
                      </form>
                      <div className="flex flex-col mt-16">
                        {data?.data?.comments?.length ? (
                          <div className="flex flex-col gap-8">
                            {data?.data?.comments?.map((comt, key) => (
                              <div key={key} className="flex gap-6">
                                <div className="w-[25px]">
                                  <Image
                                    src="/images/avatar.png"
                                    alt="logo of software"
                                    width={25}
                                    height={25}
                                  />
                                </div>
                                <div className="flex flex-col gap-4 w-full">
                                  <h3 className="text-lg text-[#2b373a]">
                                    {comt.name || ""}
                                  </h3>
                                  {/* <span className=""> {moment(comt?.created_at).format("MMM DD, YYYY")}</span> */}
                                  <p className="text-sm text-[#666] font-normal">
                                    {comt?.comment || ""}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-6 md:w-[350px] w-full ">
                  <div className="flex flex-col justify-center items-center gap-3 bg-white rounded-lg border border-solid border-[#ebebeb] p-5">
                    <div className="text-black py-3 text-5xl font-bold text-center">
                      4.9 <span className="text-lg">MB</span>
                    </div>
                    <StarRating rating={data?.data?.rating_value} />
                    <button className="buttonPrimary !py-3">
                      Direct Download
                    </button>
                  </div>
                  <div className="flex flex-col gap-3 bg-white rounded-lg border border-solid border-[#ebebeb] p-5">
                    <div className="text-black py-3 text-2xl font-medium">
                      Product Information
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-3 border-b border-gray-300/50 py-3">
                        <div className="text-sm text-black font-medium">
                          File Name
                        </div>
                        <div className="text-sm text-[#666] font-medium">
                          {data?.data?.title} {data?.data?.software_version}
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 border-b border-gray-300/50 py-3">
                        <div className="text-sm text-black font-medium">
                          Created by
                        </div>
                        <div className="text-sm text-[#666] font-medium">
                          {data?.data?.publisher_name}
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 border-b border-gray-300/50 py-3">
                        <div className="text-sm text-black font-medium">
                          Version
                        </div>
                        <div className="text-sm text-[#666] font-medium">
                          {data?.data?.software_version}
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 border-b border-gray-300/50 py-3">
                        <div className="text-sm text-black font-medium">
                          License type
                        </div>
                        <div className="text-sm text-[#666] font-medium">
                          full_version
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 border-b border-gray-300/50 py-3">
                        <div className="text-sm text-black font-medium">
                          Release Date
                        </div>
                        <h4 className="text-sm text-[#666] font-medium">
                          {moment(data?.data?.created_at).format(
                            "MMM DD, YYYY"
                          )}
                        </h4>
                      </div>
                      {/* <div className="flex items-center justify-between gap-3 border-b border-gray-300/50 py-3">
                      <h3 className="text-sm text-black font-medium">
                        Change log
                      </h3>
                      <h4 className="text-sm text-[#666] font-medium">
                        {"What's New?"}
                      </h4>
                    </div> */}
                      <div className="flex items-center justify-between gap-3 border-b border-gray-300/50 py-3">
                        <div className="text-sm text-black font-medium">
                          Languages
                        </div>
                        <div className="text-sm text-[#666] font-medium">
                          Multilingual
                        </div>
                      </div>
                      {/* <div className="flex items-center justify-between gap-3 border-b border-gray-300/50 py-3">
                      <div className="text-sm text-black font-medium">
                        Total Downloads
                      </div>
                      <div className="text-sm text-[#666] font-medium">
                        153929
                      </div>
                    </div> */}
                      {/* <div className="flex items-center justify-between gap-3 border-b border-gray-300/50 py-3">
                      <h3 className="text-sm text-black font-medium">
                        Uploaded By
                      </h3>
                      <h4 className="text-sm text-[#666] font-medium">
                        PowerISO 8.9 Multilingual
                      </h4>
                    </div> */}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Layout>
      </main>
    </HelmetWrapper>
  );
}
